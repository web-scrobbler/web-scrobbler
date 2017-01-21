'use strict';

/**
 * Factory for objects of injection result
 */
define([], function() {

	return {
		results: {
			MATCHED_AND_INJECTED: 'matched-and-injected',
			MATCHED_BUT_DISABLED: 'matched-but-disabled',
			NO_MATCH: 'no-match'
		},

		/**
		 * Object that represents result of inject of content scripts.
		 *
		 * @constructor
		 * @param {String} result Result type
		 * @param {Number} tabId Tab ID
		 * @param {Object} connector Connector match object
		 */
		InjectResult: function(result, tabId, connector) {
			this.getConnector = function() {
				return connector;
			};

			this.getResult = function() {
				return result;
			};

			this.getTabId = function() {
				return tabId;
			};
		}
	};

});
