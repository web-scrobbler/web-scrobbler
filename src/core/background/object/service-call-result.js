'use strict';

/**
 * Successfull result.
 *
 * @type {String}
 */
const RESULT_OK = 'ok';

/**
 * Song is ignored by scrobbling service.
 */
const RESULT_IGNORE = 'ignored';

/**
 * Authorization error.
 *
 * @type {String}
 */
const ERROR_AUTH = 'error-auth';

/**
 * Another error.
 *
 * @type {String}
 */
const ERROR_OTHER = 'error-other';

define(() => {
	return {
		RESULT_OK, RESULT_IGNORE, ERROR_AUTH, ERROR_OTHER,
	};
});
