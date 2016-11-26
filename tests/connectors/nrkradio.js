'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'https://radio.nrk.no/direkte/radio_super'
	});
};
