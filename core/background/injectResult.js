'use strict';

/**
 * Factory for objects of injection result
 */
define([], function() {

	return {
		results : {
			MATCHED_AND_INJECTED: 'matched-and-injected',
			MATCHED_BUT_DISABLED: 'matched-but-disabled',
			NO_MATCH: 'no-match'
		},

		/**
		 * Call with 'new' to create new inject result
		 * @param result
		 * @param {Number} tabId
		 * @param {Object} connector
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
