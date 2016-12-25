'use strict';

/**
 * Default options values.
 * @type {Object}
 */
const options = {
	'debug': false,
	'quitOnEnd': true,
};

/**
 * Get option value.
 * @param  {String} key Option key
 * @return {Any} Option value
 */
exports.get = function(key) {
	return options[key];
};

/**
 * Get connectors array specified in command line arguments.
 * @return {Array} Array of connectors file names
 */
exports.getConnectorsFromArgs = function() {
	return process.argv.slice(2).filter((arg) => {
		return arg.indexOf('=') === -1;
	});
};

/* Internal */

/**
 * Parse options values that specified in command line arguments
 * and store its values in options object.
 *
 * This function is called on module init.
 */
function processOptionsFromArgs() {
	let rawOptions = getOptionsFromArgs();
	for (let key in rawOptions) {
		let val = rawOptions[key];
		switch (key) {
			case 'debug': {
				processBooleanOption(key, val);
				break;
			}
			case 'quitOnEnd': {
				processBooleanOption(key, val);
				break;
			}
			default:
				console.log(`Unknown option: ${key}`);
				break;
		}
	}
}

/**
 * Get raw options from command line arguments.
 * @return {Object} Object containing raw options
 */
function getOptionsFromArgs() {
	let args = process.argv.slice(2).filter((arg) => {
		return arg.indexOf('=') !== -1;
	});
	let rawOptions = {};

	for (let arg of args) {
		let [key, val] = arg.split('=');
		rawOptions[key] = val;
	}

	return rawOptions;
}

/**
 * Parse boolean option value and store it in options object.
 * @param  {String} key Option key
 * @param  {String} val Option raw value
 */
function processBooleanOption(key, val) {
	if (isValueTruthy(val)) {
		options[key] = true;
	} else if (isValueFalsy(val)) {
		options[key] = false;
	} else {
		console.warn(`Unknown value of '${key}' option: ${val}`);
	}
}

/**
 * Check if raw value is truthy.
 * @param  {String} val Option raw value
 * @return {Boolean} True if raw value is truthy
 */
function isValueTruthy(val) {
	return val === 'true' || val === 'on' || val === '1';
}

/**
 * Check if raw value is falsy.
 * @param  {String} val Option raw value
 * @return {Boolean} True if raw value is falsy
 */
function isValueFalsy(val) {
	return val === 'false' || val === 'off' || val === '0';
}

processOptionsFromArgs();
