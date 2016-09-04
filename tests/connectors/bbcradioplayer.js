'use strict';

/* global connectorSpec */

module.exports = function(driver) {
	connectorSpec.loadCheckPlayer(driver, {
		url: 'http://www.bbc.co.uk/radio/player/bbc_6music'
	});
};
