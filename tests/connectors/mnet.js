'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'http://mnet.com/player/aod'
	});
};
