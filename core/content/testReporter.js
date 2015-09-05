'use strict';

/* exported testReporter */

/**
 * Log messages to console with prepended message. Also dispatches a JS event
 * to interact with tests
 * @param msg {String} message to log
 * @param [obj] {Object} object to dump with message
 * @param [err] {Boolean} TRUE if the message is an error
*/
var testReporter = function(msg, obj, err) {
	if(msg) {
		obj = obj || '';
		if(err) {
			console.error('WEB-SCROBBLER-ERROR: ' + msg, obj);
			msg = 'ERROR: ' + msg;
		} else {
			console.log('WEB-SCROBBLER-INFO: ' + msg, obj);
		}
		document.dispatchEvent(new CustomEvent('web-scrobbler-test-response', {detail: {detail: msg, data: obj}}));
	}
};
