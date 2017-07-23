'use strict';

module.exports = function(driver, connectorSpec) {
	// Auth is required
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'http://www.deezer.com/artist/1'
	});
};
