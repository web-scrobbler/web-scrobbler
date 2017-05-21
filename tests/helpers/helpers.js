'use strict';

const options = require('./options');

const MSG_INDENT = '      ';

/**
 * Print informational message.
 * @param  {String} msg Message text
 */
exports.info = function(msg) {
	console.log('%s%s', MSG_INDENT, msg);
};
/**
 * Print warning message.
 * @param  {String} msg Message text
 */
exports.warn = function(msg) {
	console.log('%s\x1b[33;1m%s\x1b[0m', MSG_INDENT, msg);
};

/**
 * Print passed message.
 * @param  {String} msg Message text
 */
exports.pass = function(msg) {
	console.log('%s\x1b[32;1m√\x1b[0m', MSG_INDENT, msg);
};

/**
 * Print failed message.
 * @param  {String} msg Message text
 */
exports.fail = function(msg) {
	console.log('%s\x1b[31;1m✗\x1b[0m', MSG_INDENT, msg);
};

/**
 * Print debug message (purple color is used). Suppressed if debug mode is off.
 * @param  {String} message Message text
 * @param  {Object} object Optional object
 */
exports.debug = function(message, object) {
	if (!options.get('debug')) {
		return;
	}

	let msgTemplate = '%s\x1b[35;1m%s\x1b[0m';
	if (object) {
		console.log(msgTemplate, MSG_INDENT, message, object);
	} else {
		console.log(msgTemplate, MSG_INDENT, message);
	}
};
