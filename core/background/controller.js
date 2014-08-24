'use strict';

/**
 * Controller for each tab
 */
define([], function() {

	/**
	 * Constructor
	 *
	 * @param {Number} tabId
	 * @param {Object} connector
	 */
	return function(tabId, connector) {

		console.log('creating controller for %O', connector);

		this.onStateChanged = function(newState) {
			console.log('Tab ' + tabId + ': state changed, %O', newState);
		};

	};

});
