'use strict';

/**
 * Defines an object for access to page action of a single controller (tab)
 */
define([], function() {

	/**
	 * Constructor
	 *
	 * @param {Number} tabId
	 */
	return function(tabId) {

		this.onClicked = function() {
			console.log('Page action clicked in tab ' + tabId);
		};

	};

});
