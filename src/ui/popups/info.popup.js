'use strict';

const fieldsToEdit = ['artist', 'track', 'album', 'albumArtist'];

const fieldUrlMap = {
	artist: 'artistUrl',
	track: 'trackUrl',
	album: 'albumUrl',
	albumArtist: 'artistUrl',
};

const modeEdit = 0;
const modeInfo = 1;

class InfoPopup {
	constructor(view) {
		this.song = null;
		this.trackFields = {};
		this.trackArtUrl = null;

		this.view = view;
		this.mode = modeInfo;
	}

	/** Listeners */

	onMessageSend(/* type, data */) {
		throw new Error('No implementation');
	}

	/** Controls */

	setInfoPopupMode(mode) {
		this.mode = mode;

		switch (this.mode) {
			case modeInfo: {
				this.view.setInfoBlockVisible();
				break;
			}
			case modeEdit: {
				this.view.setEditBlockVisible();
				this.view.focusOnInput();
				break;
			}
		}
	}

	updateTrackFields() {
		for (const field of fieldsToEdit) {
			const metaProp = fieldUrlMap[field];
			const fieldUrl = this.song.metadata[metaProp];
			const fieldValue = this.trackFields[field];

			this.view.setFieldValue(field, fieldValue);
			if (fieldUrl) {
				this.view.setFieldUrl(field, fieldUrl);
			} else {
				this.view.removeFieldUrl(field);
			}
		}
	}

	updateTrackInputs() {
		for (const field of fieldsToEdit) {
			const fieldValue = this.trackFields[field];

			this.view.setFieldInput(field, fieldValue);
		}
	}

	updateTrackInfo() {
		const {
			label, userloved, userPlayCount
		} = this.song.metadata;
		const trackArtUrl =
			this.song.parsed.trackArt || this.song.metadata.trackArtUrl;

		this.view.setTrackArt(trackArtUrl);
		this.view.setUserLovedIcon(userloved);
		this.view.setConnectorLabel(label);
		this.view.setUserPlayCount(userPlayCount);
	}

	updateControls() {
		if (this.mode === modeInfo) {
			const { isCorrectedByUser, isScrobbled, isSkipped } = this.song.flags;

			this.view.setRevertButtonVisible(isCorrectedByUser);

			if (isSkipped) {
				this.view.setEditButtonSkipped();
				this.view.setSkipButtonSkipped();
			} else {
				const isEnabled = !isScrobbled;

				this.view.setEditButtonState(isEnabled);
				this.view.setRevertButtonState(isEnabled);
				this.view.setSkipButtonState(isEnabled);
			}
		} else if (this.mode === modeEdit) {
			const isEnabled = InfoPopup.areTrackFieldsComplete(this.trackFields);

			this.view.setSwapButtonState(isEnabled);
			this.view.setSubmitButtonState(isEnabled);
		}
	}

	updateDebugInfo() {
		const data = JSON.stringify(this.song, null, 2);
		this.view.showDebugInfo(data);
	}

	/** Song manipulation */

	setSong(song) {
		if (!song) {
			return;
		}

		this.song = song;
		this.trackFields = InfoPopup.getTrackFields(song);

		const {
			isValid, isCorrectedByUser, isSkipped
		} = this.song.flags;
		const isSongValid = isValid || isCorrectedByUser;

		this.updateTrackInfo();

		if (isSongValid || isSkipped) {
			this.updateTrackFields();
			this.setInfoPopupMode(modeInfo);
		} else {
			this.updateTrackInputs();
			this.setInfoPopupMode(modeEdit);
		}

		this.updateControls();

		if (this.view.isDebugInfoVisible()) {
			this.updateDebugInfo();
		}
	}

	/** Control listeners */

	onEditBtnClick() {
		this.updateTrackInputs();
		this.setInfoPopupMode(modeEdit);
	}

	onSubmitBtnClick() {
		this.submitSong();
	}

	onSkipBtnClick() {
		this.song.flags.isSkipped = true;

		this.sendMessage('REQUEST_SKIP_SONG');
		this.updateControls();
	}

	onSwapBtnClick() {
		this.swapArtistAndTrack();
	}

	onRevertBtnClick() {
		this.sendMessage('REQUEST_RESET_SONG');
	}

	onLoveBtnClick() {
		this.sendMessage('REQUEST_TOGGLE_LOVE', {
			isLoved: !this.song.metadata.userloved
		}).then((isLoved) => {
			this.view.setUserLovedIcon(isLoved);
		});
	}

	onInputsChanged() {
		const editedTrackFields = this.view.getEditedTrackFields();
		const isInfoComplete = InfoPopup.isTrackInfoComplete(editedTrackFields);

		this.view.setSubmitButtonState(isInfoComplete);
		this.view.setSwapButtonState(isInfoComplete);
	}

	onEnterPressed() {
		const editedTrackFields = this.view.getEditedTrackFields();
		const isInfoComplete = InfoPopup.isTrackInfoComplete(editedTrackFields);

		if (isInfoComplete) {
			this.submitSong();
		}
	}

	onAltClick() {
		this.updateDebugInfo();
	}

	/** Helpers */

	areTrackFieldsChanged(editedTrackFields) {
		if (!this.song.flags.isValid) {
			return true;
		}

		for (const field in this.trackFields) {
			if (this.trackFields[field] !== editedTrackFields[field]) {
				return true;
			}
		}

		return false;
	}

	sendMessage(type, data) {
		return this.onMessageSend(type, data);
	}

	swapArtistAndTrack() {
		const editedTrackFields = this.view.getEditedTrackFields();

		this.trackFields.artist = editedTrackFields.track;
		this.trackFields.track = editedTrackFields.artist;

		this.updateTrackFields();
		this.setInfoPopupMode(modeInfo);

		this.sendMessage('REQUEST_CORRECT_SONG', this.trackFields);
	}

	submitSong() {
		const editedTrackFields = this.view.getEditedTrackFields();

		if (this.areTrackFieldsChanged(editedTrackFields)) {
			this.setTrackFields(editedTrackFields);
			this.updateTrackFields();

			this.sendMessage('REQUEST_CORRECT_SONG', editedTrackFields);
		}

		this.setInfoPopupMode(modeInfo);
	}

	setTrackFields(trackFields) {
		for (const field of fieldsToEdit) {
			this.trackFields[field] = trackFields[field];
		}
	}

	/** Misc */

	static getTrackFields(song) {
		const trackFields = {};

		for (const field of fieldsToEdit) {
			trackFields[field] = song.processed[field] || song.parsed[field];
		}

		return trackFields;
	}

	static areTrackFieldsComplete(trackFields) {
		return trackFields.artist && trackFields.track;
	}
}

define(() => InfoPopup);
