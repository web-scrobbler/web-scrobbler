'use strict';

module.exports = function(driver, connectorSpec) {
	// Strange play control elements
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'https://www.radioparadise.com/'
	});
};
