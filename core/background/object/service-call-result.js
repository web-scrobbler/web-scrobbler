'use strict';

/**
 * Object that represents result of service call.
 */
class ServiceCallResult {
	/**
	 * Class constructor.
	 * @constructor
	 * @param {String} type Result type
	 */
	constructor(type) {
		this.type = type;
	}

	/**
	 * Check if result is w/o errors.
	 * @return {Boolean} Check result
	 */
	isOk() {
		return this.type === ServiceCallResult.OK;
	}

	/**
	 * Check if result is error.
	 * @return {Boolean} Check result
	 */
	isAuthError() {
		return this.type === ServiceCallResult.ERROR_AUTH;
	}

	/**
	 * No errors.
	 */
	static get OK() {
		return 'ok';
	}

	/**
	 * Song is ignored by scrobbling service.
	 */
	static get IGNORED() {
		return 'ignored';
	}

	/**
	 * Authorization error.
	 */
	static get ERROR_AUTH() {
		return 'error-auth';
	}

	/**
	 * Other error.
	 */
	static get ERROR_OTHER() {
		return 'error-other';
	}
}

define(() => ServiceCallResult);
