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
	reportInjection: function(connector) {
		this.sendEventToTest('connector_injected');

		if (connector.playerSelector &&
			document.querySelector(connector.playerSelector)) {
			this.sendEventToTest('player_element_exists');
		}
	},

	/**
	 * Notify the test that player element exists.
	 */
	reportPlayerElementExists: function() {
		this.sendEventToTest('player_element_exists');
	},

	/**
	 * Notify the test that song is recognized.
	 * @param  {Object} song Recognized song
	 */
	reportSongRecognition: function(song) {
		this.sendEventToTest('connector_state_changed', song);
	},

	/**
	 * Dispatch a JS event to interact with tests.
	 * @param  {String} event Event to send to tests
	 * @param  {Object} obj Object to send to tests
	 * @param  {Boolean} err True if the message is an error
	 *
	 * Events:
	 *  * 'connector_injected': the connector is injected into a page
	 *       data: null
	 *  * 'player_element_exists': player element is found on a page
	 *	     data: null
	 *  * 'connector_state_changed': state of the connector is changed
	 *       data: currentState
	 */
	sendEventToTest: function(event, obj, err) {
		if (err) {
			console.error('Web Scrobbler: ' + event, obj);
		} else {
			console.log('Web Scrobbler: ' + event, obj);
		}
		document.dispatchEvent(new CustomEvent('web-scrobbler-test-response', {
			detail: {
				detail: event,
				data: obj
			}
		}));
	}
};

// @endif
