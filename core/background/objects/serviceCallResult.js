'use strict';

/**
 * Factory for objects of service call result
 */

class ServiceCallResult {
	/**
	 * Object that represents result of service call.
	 *
	 * @constructor
	 * @param {String} type Result type
	 */
	constructor(type) {
		this.type = type;
	}

	isOk() {
		return this.type === ServiceCallResult.OK;
	}

	isAuthError() {
		return this.type === ServiceCallResult.ERROR_AUTH;
	}

	static get OK() {
		return 'ok';
	}

	static get ERROR_AUTH() {
		return 'error-auth';
	}

	static get ERROR_OTHER() {
		return 'error-other';
	}
}

define([], () => ServiceCallResult);
