'use strict';

class InjectResult {
	/**
	 * Object that represents result of inject of content scripts.
	 *
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

	static get MATCHED_AND_INJECTED() {
		return 'matched-and-injected';
	}

	static get MATCHED_BUT_DISABLED() {
		return 'matched-but-disabled';
	}

	static get NO_MATCH() {
		return 'no-match';
	}
}

define([], () => {
	return InjectResult;
});
