'use strict';

/**
 * Module that parses options specified as CLI arguments.
 */

const MODE_CORE = 'core';
const MODE_CONNECTORS = 'connectors';

const TYPE_BOOLEAN = 'boolean';
const TYPE_ARRAY = 'array';

const SEPARATOR = ',';

/**
 * Default options values.
 * @type {Object}
 */
const options = {
	debug: {
		value: false,
		context: [MODE_CORE, MODE_CONNECTORS],
		type: TYPE_BOOLEAN
	},
	skip: {
		value: [],
		context: [MODE_CONNECTORS],
		type: TYPE_ARRAY
	},
	quitOnEnd: {
		value: true,
		context: [MODE_CONNECTORS],
		type: TYPE_BOOLEAN
	},
};

/**
 * Get option value.
 * @param  {String} key Option key
 * @return {Any} Option value
 */
exports.get = function(key) {
	return options[key].value;
};

/**
 * Get connectors array specified in command line arguments.
 * @return {Array} Array of connectors file names
 */
exports.getConnectorsFromArgs = function() {
	return process.argv.slice(2).filter((arg) => {
		return !arg.includes('=');
	});
};

/**
 * Get test mode defined by user. Test mode can be defined as
 * command line argument.
 *
 * There are two modes only: 'core' and 'connectors'.
 *
 * @return {String} Test mode
 */
exports.getTestMode = function() {
	function isCoreMode() {
		return process.argv.slice(2).some((arg) => {
			return arg === 'core';
		});
	}

	if (isCoreMode()) {
		return MODE_CORE;
	}

	return MODE_CONNECTORS;
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
		if (!options.hasOwnProperty(key)) {
			console.warn(`Unknown option: ${key}`);
			continue;
		}

		let context = exports.getTestMode();
		let optionsData = options[key];
		if (!optionsData.context.includes(context)) {
			console.warn(`The option is not allowed in ${context} context: ${key}`);
			continue;
		}

		let val = rawOptions[key];
		try {
			switch (optionsData.type) {
				case TYPE_BOOLEAN: {
					options[key].value = processBooleanOption(val);
					break;
				}
				case TYPE_ARRAY: {
					options[key].value = processArrayOption(val);
					break;
				}
			}
		} catch (err) {
			console.warn(`Unknown value of '${key}' option: ${val}`);
		}
	}
}

/**
 * Get raw options from command line arguments.
 * @return {Object} Object containing raw options
 */
function getOptionsFromArgs() {
	let args = process.argv.slice(2).filter((arg) => {
		return arg.includes('=');
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
 * @param  {String} val Option raw value
 * @return {Boolean} Processed value
 */
function processBooleanOption(val) {
	if (isValueTruthy(val)) {
		return true;
	} else if (isValueFalsy(val)) {
		return false;
	}

	throw new Error('Invalid value');
}

/**
 * Parse value constains listed strings and store it in options object.
 * @param  {String} val Option raw value
 * @return {Array} Processed value
 */
function processArrayOption(val) {
	if (val && typeof val === 'string') {
		return val.split(SEPARATOR).map((value) => value.trim());
	}

	throw new Error('Invalid value');
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
