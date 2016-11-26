'use strict';

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
 * Print debug message (purple color is used). Suppressed if global.DEBUG is false
 * @param  {String} message Message text
 * @param  {Object} object Optional object
 */
exports.debug = function(message, object) {
	if (!global.DEBUG) {
		return;
	}

	var msgTemplate = '%s\x1b[35;1m%s\x1b[0m';
	if (object) {
		console.log(msgTemplate, MSG_INDENT, message, object);
	} else {
		console.log(msgTemplate, MSG_INDENT, message);
	}
};

exports.getConnectorsFromArgs = function() {
	return process.argv.slice(2).filter((arg) => {
		return arg.indexOf('=') === -1;
	});
};

exports.getOptionsFromArgs = function() {
	let args = process.argv.slice(2).filter((arg) => {
		return arg.indexOf('=') !== -1;
	});
	let options = {};

	for (let arg of args) {
		let [key, val] = arg.split('=');
		options[key] = val;
	}

	return options;
};

exports.processOptionValue = function(val) {
	if (isValueOn(val)) {
		return true;
	} else if (isValueOff(val)) {
		return false;
	} else {
		return null;
	}
};

function isValueOn(val) {
	return val === 'true' || val === 'on' || val === '1';
}

function isValueOff(val) {
	return val === 'false' || val === 'off' || val === '0';
}
