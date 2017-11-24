'use strict';

/**
 * Implementation of Measurement Protocol. Includes Universal Analytics
 * tracking code and provides methods for sending data.
 *
 * https://developers.google.com/analytics/devguides/collection/protocol/v1/
 *
 * Does not track anything automatically.
 */
define((require) => {
	const ChromeStorage = require('storage/chromeStorage');

	const options = ChromeStorage.getStorage(ChromeStorage.OPTIONS);

	const GA_URL = 'https://www.google-analytics.com/collect';
	const GA_TRACKING_ID = 'UA-16968457-1';
	const GA_CLIENT_ID = getClientId();
	const GA_PROTOCOL_VERSION = 1;

	/**
	 * Send 'event' hit.
	 * @param  {String} ec Event category
	 * @param  {String} ea Event action
	 * @param  {String} el Event label
	 * @return {Promise} Promise that will resolve when the task has completed
	 */
	function event(ec, ea, el) {
		return sendRequest({ t: 'event', ec, ea, el });
	}

	/**
	 * Send 'pageview' hit.
	 * @param  {String} dp Document path
	 * @return {Promise} Promise that will resolve when the task has completed
	 */
	function pageview(dp) {
		return sendRequest({ t: 'pageview', dp });
	}

	/**
	 * Send request to Google Analytics API.
	 * @param  {Object} query Payload data
	 * @return {Promise} Promise that will resolve when the task has completed
	 */
	function sendRequest(query) {
		return isAllowed().then((flag) => {
			if (!flag) {
				return Promise.resolve();
			}

			query.v = GA_PROTOCOL_VERSION;
			query.tid = GA_TRACKING_ID;
			query.cid = GA_CLIENT_ID;

			return fetch(GA_URL, {
				method: 'POST', body: $.param(query)
			}).catch((e) => {
				console.error(`Error sending report to Google Analytics: ${e}`);
			});
		});
	}

	/**
	 * Get client ID. Generate new one if previously client ID is missing.
	 * @return {String} Client ID
	 */
	function getClientId() {
		let clientId = readCliendId();

		if (clientId === null) {
			clientId = generateClientId();
			saveClientId(clientId);
		}

		return clientId;
	}

	/**
	 * Read cliend ID from cookie.
	 * It was previously stored by 'analytics.js'.
	 * @return {String} Client ID
	 */
	function readCliendId() {
		let match = document.cookie.match('(?:^|;)\\s*_ga=([^;]*)');
		if (match) {
			let gaCookieValue = match[1];
			let rawGaCid = decodeURIComponent(gaCookieValue);
			return rawGaCid.match(/(\d+\.\d+)$/)[1];
		}

		return null;
	}

	/**
	 * Generate new cliend ID. The format of ID is compatible with
	 * 'analytics.js' script.
	 * @return {String} Client ID
	 */
	function generateClientId() {
		let random1 = Math.round(2147483647 * Math.random());
		let random2 = Math.round(2147483647 * Math.random());
		let clientId = `${random1}.${random2}`;

		return clientId;
	}

	/**
	 * Save client ID to cookie.
	 * @param  {String} clientId Client ID
	 */
	function saveClientId(clientId) {
		document.cookie = `_ga=GA1.1.${clientId}`;
	}

	/**
	 * Check if GA tracking is allowed by user.
	 * @return {Boolean} True if GA is allowed; false otherwise
	 */
	function isAllowed() {
		return options.get().then((data) => {
			return !data.disableGa;
		});
	}

	return { event, pageview };
});
