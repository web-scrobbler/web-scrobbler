'use strict';

/* exported testReporter */

/**
 * Dispatch a JS event to interact with tests
 * @param  {String} msg Message to send to tests
 * @param  {Object} obj Object to send to tests
 * @param  {Boolean} err True if the message is an error
 *
 * Messages:
 *  'connector_injected' - connector is injected
 *  'connector_state_changed' - state of connector is changed
 *     data: currentState
 */
var testReporter = function(msg, obj, err) {
	if (err) {
		console.error('WEB-SCROBBLER-ERROR: ' + msg, obj);
	} else {
		console.log('WEB-SCROBBLER-INFO: ' + msg, obj);
	}
	document.dispatchEvent(new CustomEvent('web-scrobbler-test-response', {
		detail: {
			detail: msg,
			data: obj
		}}
	));
};
