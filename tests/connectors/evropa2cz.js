'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'http://onair.europa2.sk'
	});
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'http://onair.europa2.sk'
	});
};
