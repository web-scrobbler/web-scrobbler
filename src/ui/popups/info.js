'use strict';

require([
	'webextension-polyfill',
	'popups/info.popup',
	'popups/info.view',
], (browser, InfoPopup, InfoPopupView) => {
	/** General code */

	/**
	 * Entry point.
	 */
	async function main() {
		const infoPopupView = new InfoPopupViewImpl();

		browser.runtime.onMessage.addListener((request) => {
			if (request.type !== 'EVENT_SONG_UPDATED') {
				return;
			}

			infoPopupView.getInfoPopup().setSong(request.data);
		});

		infoPopupView.getInfoPopup().setSong(await requestCurrentSong());
	}

	/** Implementations */

	class InfoPopupImpl extends InfoPopup {
		/** @override */
		onMessageSend(type, data) {
			return sendMessageToActiveTab(type, data);
		}
	}

	class InfoPopupViewImpl extends InfoPopupView {
		/** @override */
		makeInfoPopup() {
			return new InfoPopupImpl(this);
		}

		/** @override */
		i18n(messageId, ...placeholders) {
			return browser.i18n.getMessage(messageId, placeholders) || messageId;
		}
	}

	/** Helpers */

	/**
	 * Request a copy of a current song of active tab.
	 *
	 * @return {Object} Copy of current song
	 */
	function requestCurrentSong() {
		return sendMessageToActiveTab('REQUEST_GET_SONG');
	}

	/**
	 * Send a message to an active tab.
	 *
	 * @param  {String} type Message type
	 * @param  {Object} data Data to send
	 *
	 * @return {Object} Response data
	 */
	async function sendMessageToActiveTab(type, data) {
		const tabId = await sendMessage('REQUEST_ACTIVE_TABID');

		return browser.runtime.sendMessage({ type, data, tabId });
	}

	/**
	 * Send a message via `runtime.sendMessage`.
	 *
	 * @param  {String} type Message type
	 * @param  {Object} data Data to send
	 *
	 * @return {Object} Response data
	 */
	async function sendMessage(type, data) {
		return browser.runtime.sendMessage({ type, data });
	}

	main();
});
