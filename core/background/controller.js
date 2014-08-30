'use strict';

/**
 * Controller for each tab
 */
define([
	'pageAction'
], function(PageAction) {

	/**
	 * Constructor
	 *
	 * @param {Number} tabId
	 * @param {Object} connector
	 */
	return function(tabId, connector) {

		var pageAction = new PageAction(tabId);

		console.log('creating controller for %O', connector);

		this.onStateChanged = function(newState) {
			console.log('Tab ' + tabId + ': state changed, %O', newState);
		};

		this.onPageActionClicked = function() {
			pageAction.onClicked();
		};

	};

});
