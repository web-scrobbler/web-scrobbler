'use strict';

// @ifdef DEBUG

/**
 * Provide functions to interact with tests.
 */

// eslint-disable-next-line no-unused-vars
const TestReporter = {
	/**
	 * Notify the test that connector is injected.
	 * @param  {Object} connector Injected connector
	 */
	reportInjection(connector) {
		this.sendEventToTest('connector_injected');

		if (connector.playerSelector &&
			document.querySelector(connector.playerSelector)) {
			this.sendEventToTest('player_element_exists');
		}
	},

	/**
	 * Notify the test that player element exists.
	 */
	reportPlayerElementExists() {
		this.sendEventToTest('player_element_exists');
	},

	/**
	 * Notify the test that song is recognized.
	 * @param  {Object} song Recognized song
	 */
	reportSongRecognition(song) {
		this.sendEventToTest('connector_state_changed', song);
	},

	/**
	 * Dispatch a JS event to interact with tests.
	 * @param  {String} detail Event to send to tests
	 * @param  {Object} data Object to send to tests
	 *
	 * Events:
	 *  * 'connector_injected': the connector is injected into a page
	 *       data: null
	 *  * 'player_element_exists': player element is found on a page
	 *	     data: null
	 *  * 'connector_state_changed': state of the connector is changed
	 *       data: currentState
	 */
	sendEventToTest(detail, data) {
		let logMessage = `Web Scrobbler: Send "${detail}" event`;
		if (data) {
			let dataStr = JSON.stringify(data, null, 2);
			logMessage = `${logMessage}: ${dataStr}`;
		}
		console.log(logMessage);

		document.dispatchEvent(new CustomEvent('web-scrobbler-test-response', {
			detail: { detail, data }
		}));
	}
};

// @endif
