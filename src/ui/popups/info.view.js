'use strict';

const editBlockId = 'edit';
const infoBlockId = 'info';

const trackArtLinkId = 'album-art-link';
const trackArtImgId = 'album-art-img';

const editBtnId = 'edit-link';
const loveBtnId = 'love-link';
const skipBtnId = 'skip-link';
const unskipBtnId = 'unskip-link';
const submitBtnId = 'submit-link';
const swapBtnId = 'swap-link';
const revertBtnId = 'revert-link';

const labelId = 'label';
const playCountContainerId = 'userPlayCount';
const playCountLabelId = 'userPlayCountLabel';

const debugTextId = 'debug-text';
const debugContainerId = 'debug';

const inputGenericId = 'input';

const fieldTitleMap = {
	album: 'infoViewAlbumPage',
	track: 'infoViewTrackPage',
	artist: 'infoViewArtistPage',
	albumArtist: 'infoViewArtistPage',
};

const defaultTrackArtUrl = '/icons/cover_art_default.png';

class InfoPopupView {
	constructor() {
		this.infoPopup = this.makeInfoPopup();

		this.clickListeners = {
			[loveBtnId]: this.infoPopup.onLoveBtnClick,

			[editBtnId]: this.infoPopup.onEditBtnClick,
			[revertBtnId]: this.infoPopup.onRevertBtnClick,
			[skipBtnId]: this.infoPopup.onSkipBtnClick,
			[submitBtnId]: this.infoPopup.onSubmitBtnClick,
			[swapBtnId]: this.infoPopup.onSwapBtnClick,
		};

		this.setupControlListeners();
	}

	/**
	 * Functions must be implemented.
	 */

	makeInfoPopup() {
		throw new Error('No implementation!');
	}

	i18n(/* messageId, ...placeholders */) {
		throw new Error('No implementation!');
	}

	/** Basic functions */

	getInfoPopup() {
		return this.infoPopup;
	}

	/** Controls */

	focusOnInput() {
		const firstInput = document.getElementsByTagName(inputGenericId)[0];
		return firstInput.focus();
	}

	isDebugInfoVisible() {
		const debugContainer = document.getElementById(debugContainerId);
		return !debugContainer.hidden;
	}

	setConnectorLabel(label) {
		const labelElement = document.getElementById(labelId);
		labelElement.textContent = label;
	}

	setEditBlockVisible() {
		document.getElementById(infoBlockId).hidden = true;
		document.getElementById(editBlockId).hidden = false;
	}

	setInfoBlockVisible() {
		document.getElementById(infoBlockId).hidden = false;
		document.getElementById(editBlockId).hidden = true;
	}

	setTrackArt(trackArtUrl) {
		const url = trackArtUrl || defaultTrackArtUrl;
		document.getElementById(trackArtImgId).setAttribute('src', url);
		document.getElementById(trackArtLinkId).setAttribute('href', url);
	}

	setUserLovedIcon(isLoved) {
		const loveButon = document.getElementById(loveBtnId);

		if (isLoved) {
			loveButon.classList.add('loved');
			loveButon.classList.remove('unloved');
		} else {
			loveButon.classList.remove('loved');
			loveButon.classList.add('unloved');
		}

		loveButon.setAttribute('title', this.i18n(isLoved ? 'infoUnlove' : 'infoLove'));
	}

	setUserPlayCount(playCount) {
		const playCountContainer = document.getElementById(playCountContainerId);
		const playCountLabel = document.getElementById(playCountLabelId);

		if (playCount) {
			playCountContainer.hidden = false;
			playCountContainer.setAttribute('title', this.i18n('infoYourScrobbles', playCount));

			playCountLabel.textContent = playCount.toString();
		} else {
			playCountContainer.hidden = true;
		}
	}

	showDebugInfo(data) {
		const debugContainer = document.getElementById(debugContainerId);
		const debugText = document.getElementById(debugTextId);

		debugContainer.hidden = false;
		debugText.textContent = data;
	}

	/** Buttons */

	setEditButtonState(flag) {
		this.setButtonState(
			editBtnId, flag, 'infoEditTitle', 'infoEditUnableTitle'
		);
	}

	setRevertButtonState(flag) {
		this.setButtonState(
			revertBtnId, flag, 'infoRevertTitle', 'infoRevertUnableTitle'
		);
	}

	setRevertButtonVisible(isVisible) {
		this.setControlVisible(revertBtnId, isVisible);
	}

	setSkipButtonState(flag) {
		this.setButtonState(
			skipBtnId, flag, 'infoSkipTitle', 'infoSkipUnableTitle'
		);
	}

	setSkipButtonVisible(isVisible) {
		this.setControlVisible(skipBtnId, isVisible);
	}

	setSubmitButtonState(flag) {
		this.setButtonState(
			submitBtnId, flag, 'infoSubmitTitle', 'infoSubmitUnableTitle'
		);
	}

	setSwapButtonState(flag) {
		this.setButtonState(
			swapBtnId, flag, 'infoSwapTitle', 'infoSwapUnableTitle'
		);
	}

	setUnskipButtonState(flag) {
		this.setButtonState(
			unskipBtnId, flag, 'infoSkippedTitle', 'infoSkippedTitle'
		);
	}

	setUnskipButtonVisible(isVisible) {
		this.setControlVisible(unskipBtnId, isVisible);
	}

	/** Fields */

	getEditedTrackFields() {
		const trackInfo = {};

		for (const field of ['artist', 'track', 'album', 'albumArtist']) {
			const inputId = InfoPopupView.getInputId(field);
			const input = document.getElementById(inputId);
			trackInfo[field] = input.value.trim() || null;
		}

		return trackInfo;
	}

	setFieldValue(field, value) {
		const fieldId = InfoPopupView.getFieldId(field);

		const fieldElement = document.getElementById(fieldId);
		fieldElement.textContent = value;
		fieldElement.hidden = !value;
	}

	setFieldInput(field, value) {
		const inputId = InfoPopupView.getInputId(field);

		const input = document.getElementById(inputId);
		input.value = value;
	}

	setFieldUrl(field, url) {
		const fieldId = InfoPopupView.getFieldId(field);
		const fieldTitleId = fieldTitleMap[field];

		const fieldElement = document.getElementById(fieldId);
		fieldElement.setAttribute('href', url);
		fieldElement.setAttribute('title', this.i18n(fieldTitleId));
	}

	removeFieldUrl(field) {
		const fieldId = InfoPopupView.getFieldId(field);

		const fieldElement = document.getElementById(fieldId);
		fieldElement.removeAttribute('href');
		fieldElement.removeAttribute('title');
	}

	/** Internal functions */

	setupControlListeners() {
		for (const elementId in this.clickListeners) {
			const onClick = this.clickListeners[elementId].bind(this.infoPopup);

			const element = document.getElementById(elementId);
			element.addEventListener('click', () => {
				onClick();
			});
		}

		const inputs = document.getElementsByTagName(inputGenericId);
		for (const input of inputs) {
			input.addEventListener('keyup', (e) => {
				const isSubmitAction = e.key === 'Enter';

				if (isSubmitAction) {
					this.infoPopup.onEnterPressed();
				} else {
					this.infoPopup.onInputsChanged();
				}
			});
		}

		document.body.addEventListener('click', (e) => {
			if (e.altKey) {
				this.infoPopup.onAltClick();
			}
		});
	}

	setControlEnabled(controlId, state) {
		const control = document.getElementById(controlId);
		if (state) {
			control.removeAttribute('disabled');
		} else {
			control.setAttribute('disabled', true);
		}
	}

	setControlVisible(controlId, isVisible) {
		const control = document.getElementById(controlId);
		control.hidden = !isVisible;
	}

	setButtonTitle(buttonId, titleId) {
		const title = this.i18n(titleId);
		document.getElementById(buttonId).setAttribute('title', title);
	}

	setButtonState(selector, state, enabledTitleId, disabledTitleId) {
		this.setControlEnabled(selector, state);
		if (state) {
			this.setButtonTitle(selector, enabledTitleId);
		} else {
			this.setButtonTitle(selector, disabledTitleId);
		}
	}

	/** Helpers */

	static getFieldId(field) {
		return field;
	}

	static getInputId(field) {
		return `${field}-input`;
	}
}

define(() => InfoPopupView);
