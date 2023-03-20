'use strict';

/**
 * All content scripts are already injected.
 *
 * @type {String}
 */
const INJECTED = 'injected';

/**
 * The connector is matched and all content scripts are injected.
 *
 * @type {String}
 */
const MATCHED = 'matched';

/**
 * The connector is not matched.
 *
 * @type {String}
 */
const NO_MATCH = 'no-match';

define(() => {
	return { INJECTED, MATCHED, NO_MATCH };
});
