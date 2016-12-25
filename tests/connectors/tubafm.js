'use strict';

module.exports = function(driver, connectorSpec) {
	// Contains Anti-adblock script
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'http://fm.tuba.pl/play/39/2/radio-tuba-top-hits',
	});
};
