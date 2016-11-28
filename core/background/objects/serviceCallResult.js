'use strict';

/**
 * Factory for objects of service call result
 */
define([], function() {
	function ServiceCallResult(result) {
		this.getResult = function() {
			return result;
		};

		this.isOk = function() {
			return result === ServiceCallResult.OK;
		};
	}

	ServiceCallResult.OK = 'ok';
	ServiceCallResult.ERROR_AUTH = 'error-auth';
	ServiceCallResult.ERROR_OTHER = 'error-other';

	return ServiceCallResult;
});
