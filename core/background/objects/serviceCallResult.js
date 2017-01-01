'use strict';

/**
 * Factory for objects of service call result
 */
define([], function() {
	const OK = 'ok';
	const ERROR_AUTH = 'error-auth';
	const ERROR_OTHER = 'error-other';

	/**
	 * Object that represents result of service call.
	 */
	class ServiceCallResult {
		constructor(result) {
			this.result = result;
		}

		/**
		 * Check if result is OK.
		 * @return {Boolean} True if result is OK.
		 */
		isOk() {
			return this.result === OK;
		}

		/**
		 * Check if result is auth error.
		 * @return {Boolean} True if result is auth error.
		 */
		isAuthError() {
			return this.result === ERROR_AUTH;
		}
	}

	/**
	 * Create object with 'OK' result.
	 * @return {Object} ServiceCallResult object
	 */
	function Ok() {
		return new ServiceCallResult(OK);
	}

	/**
	 * Create object with 'ERROR_OTHER' result.
	 * @return {Object} ServiceCallResult object
	 */
	function OtherError() {
		return new ServiceCallResult(ERROR_OTHER);
	}

	/**
	 * Create object with 'ERROR_AUTH' result.
	 * @return {Object} ServiceCallResult object
	 */
	function AuthError() {
		return new ServiceCallResult(ERROR_AUTH);
	}

	return { Ok, OtherError, AuthError };
});
