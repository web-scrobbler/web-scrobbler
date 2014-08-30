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


		this.onStateChanged = function(newState) {
			console.log('Tab ' + tabId + ': state changed, %O', newState);
		};

		this.onPageActionClicked = function() {
			pageAction.onClicked();
		};


		// setup initial page action; the controller means the page was recognized
		pageAction.setSiteSupported();

		console.log('created controller for connector %O', connector);

	};

});
