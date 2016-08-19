'use strict';

/* global connectorSpec */

module.exports = function(driver) {
	connectorSpec.loadSite(driver, {
		url: 'http://www.bbc.co.uk/radio/player/bbc_6music'
	});
};
