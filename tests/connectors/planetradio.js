'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'https://planetradio.co.uk/planet-rock/player/'
	});
};
