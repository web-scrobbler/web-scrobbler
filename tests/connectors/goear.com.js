'use strict';

module.exports = function(driver, connectorSpec) {
	// Private website
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'http://goear.com/'
	});
};
