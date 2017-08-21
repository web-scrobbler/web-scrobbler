'use strict';

/**
 * Object that represents result of inject of content scripts.
 */
class InjectResult {
	/**
	 * Class constructor.
	 * @constructor
	 * @param {String} type Result type
	 * @param {Number} tabId Tab ID
	 * @param {Object} connector Connector match object
	 */
	constructor(type, tabId, connector) {
		this.type = type;
		this.tabId = tabId;
		this.connector = connector;
	}

	/**
	 * The connector is matched and all content scripts are injected.
	 */
	static get MATCHED_AND_INJECTED() {
		return 'matched-and-injected';
	}

	/**
	 * The connector is matched but is disabled by user.
	 */
	static get MATCHED_BUT_DISABLED() {
		return 'matched-but-disabled';
	}

	/**
	 * The connector is not matched.
	 */
	static get NO_MATCH() {
		return 'no-match';
	}
}

define(() => InjectResult);
