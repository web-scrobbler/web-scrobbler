'use strict';
define(function() {
	return {
		/**
		 * @param {String} label
		 * @returns boolean
		 */
		isConnectorEnabled: function(label) {
			var disabledArray = JSON.parse(localStorage.disabledConnectors);
			return (disabledArray.indexOf(label) === -1);
		}
	};
});
