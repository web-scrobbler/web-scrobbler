'use strict';

module.exports = function(driver, connectorSpec) {
	// Too complex website UI
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'https://douban.fm/'
	});
};
