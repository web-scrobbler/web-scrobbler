'use strict';

// @ifdef DEBUG

/* exported TestReporter */

/**
 * Provide functions to interact with tests.
 */
var TestReporter = function createTestReporter() {
	return {
		/**
		 * Notify the test that connector is injected.
		 * @param  {Object} connector Injected connector
		 */
		reportInjection: function(connector) {
			sendEventToTest('connector_injected');

			if (connector.playerSelector &&
				document.querySelector(connector.playerSelector)) {
				sendEventToTest('player_element_exists');
			}
		},

		/**
		 * Notify the test that player element exists.
		 */
		reportPlayerElementExists: function() {
			sendEventToTest('player_element_exists');
		},

		/**
		 * Notify the test that song is recognized.
		 * @param  {Object} song Recognized song
		 */
		reportSongRecognition: function(song) {
			sendEventToTest('connector_state_changed', song);
		}
	};
}();

/* Internal */

/**
 * Dispatch a JS event to interact with tests.
 * @param  {String} msg Event to send to tests
 * @param  {Object} obj Object to send to tests
 * @param  {Boolean} err True if the message is an error
 *
 * Events:
 *  'connector_injected' - connector is injected
 *     data: connector copy
 *  'connector_state_changed' - state of connector is changed
 *     data: currentState
 */
function sendEventToTest(event, obj, err) {
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

// @endif
