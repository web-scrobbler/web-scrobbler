'use strict';

module.exports = function(driver, connectorSpec) {
	// Player element is in iframe
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'https://noisefm.ru/'
	});
};
