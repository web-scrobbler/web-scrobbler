'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'http://aolradio.slacker.com/'
	});

	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'http://www.slacker.com/'
	});
};
