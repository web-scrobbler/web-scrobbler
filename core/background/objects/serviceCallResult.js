'use strict';

/**
 * Factory for objects of service call result
 */
define([], function() {

	var results = {
		OK: 'ok',
		ERROR_AUTH: 'error-auth',
		ERROR_OTHER: 'error-other'
	};

	return {
		results: results,

		/**
		 * Call with 'new' to create new service call result
		 * @param result
		 */
		ServiceCallResult: function(result) {
			this.getResult = function() {
				return result;
			};

			this.isOk = function() {
				return result === results.OK;
			};
		}
	};

});
