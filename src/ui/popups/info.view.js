'use strict';

const editBlockId = '#edit';
const infoBlockId = '#info';

const trackArtLinkId = '#album-art-link';
const trackArtImgId = '#album-art-img';

const editBtnId = '#edit-link';
const loveBtnId = '#love-link';
const skipBtnId = '#skip-link';
const unskipBtnId = '#unskip-link';
const submitBtnId = '#submit-link';
const swapBtnId = '#swap-link';
const revertBtnId = '#revert-link';

const inputGenericId = '#edit input';

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
		$(inputGenericId).first().focus();
	}

	isDebugInfoVisible() {
		return $('#debug').prop('hidden') === false;
	}

	setConnectorLabel(label) {
		$('#label').text(label);
	}

	setEditBlockVisible() {
		$(infoBlockId).prop('hidden', true);
		$(editBlockId).prop('hidden', false);
	}

	setInfoBlockVisible() {
		$(infoBlockId).prop('hidden', false);
		$(editBlockId).prop('hidden', true);
	}

	setTrackArt(url) {
		$(trackArtImgId).attr('src', url || defaultTrackArtUrl);
		$(trackArtLinkId).attr('href', url || defaultTrackArtUrl);
	}

	setUserLovedIcon(isLoved) {
		if (isLoved) {
			$(loveBtnId).addClass('loved');
			$(loveBtnId).removeClass('unloved');
		} else {
			$(loveBtnId).addClass('unloved');
			$(loveBtnId).removeClass('loved');
		}
		$(loveBtnId).attr('title', this.i18n(isLoved ? 'infoUnlove' : 'infoLove'));
	}

	setUserPlayCount(playCount) {
		if (playCount === 0) {
			$('#userPlayCount').prop('hidden', true);
		} else {
			$('#userPlayCount').prop('hidden', false);
			$('#userPlayCount').attr('title', this.i18n('infoYourScrobbles', playCount));
			$('#userPlayCountLabel').text(playCount);
		}
	}

	showDebugInfo(data) {
		$('#debug').prop('hidden', false);
		$('#debug pre').text(data);
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

	setRevertButtonVisible(flag) {
		$(revertBtnId).prop('hidden', !flag);
	}

	setSkipButtonState(flag) {
		this.setButtonState(
			skipBtnId, flag, 'infoSkipTitle', 'infoSkipUnableTitle'
		);
	}

	setSkipButtonVisible(flag) {
		$(skipBtnId).prop('hidden', !flag);
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

	setUnskipButtonVisible(flag) {
		$(unskipBtnId).prop('hidden', !flag);
	}

	/** Fields */

	getEditedTrackFields() {
		const trackInfo = {};

		for (const field of ['artist', 'track', 'album', 'albumArtist']) {
			const selector = InfoPopupView.getInputSelector(field);
			trackInfo[field] = $(selector).val().trim() || null;
		}

		return trackInfo;
	}

	setFieldValue(field, value) {
		const selector = InfoPopupView.getFieldSelector(field);

		$(selector).text(value);
		$(selector).prop('hidden', !value);
	}

	setFieldInput(field, value) {
		const selector = InfoPopupView.getInputSelector(field);

		$(selector).val(value);
	}

	setFieldUrl(field, url, title) {
		const selector = InfoPopupView.getFieldSelector(field);
		const fieldTitleId = fieldTitleMap[field];

		$(selector).attr('href', url);
		$(selector).attr('title', this.i18n(fieldTitleId, title));
	}

	removeFieldUrl(field) {
		const selector = InfoPopupView.getFieldSelector(field);

		$(selector).removeAttr('href');
		$(selector).removeAttr('title');
	}

	/** Internal functions */

	setupControlListeners() {
		for (const controlId in this.clickListeners) {
			const onClick = this.clickListeners[controlId].bind(this.infoPopup);

			$(controlId).off('click');
			$(controlId).on('click', () => {
				onClick();
			});
		}

		$(inputGenericId).off('keydown');
		$(inputGenericId).on('keydown', (e) => {
			const isSubmitAction = e.which === 13;

			if (isSubmitAction) {
				this.infoPopup.onEnterPressed();
			} else {
				this.infoPopup.onInputsChanged();
			}
		});

		$('body').click((e) => {
			if (e.altKey) {
				this.infoPopup.onAltClick();
			}
		});
	}

	setControlEnabled(selector, state) {
		$(selector).prop('disabled', !state);
	}

	setButtonTitle(selector, titleId) {
		$(selector).attr('title', this.i18n(titleId));
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

	static getFieldSelector(field) {
		return `#${field}`;
	}

	static getInputSelector(field) {
		return `#${field}-input`;
	}
}

define(() => InfoPopupView);
