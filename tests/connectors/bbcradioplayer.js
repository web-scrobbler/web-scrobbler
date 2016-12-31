'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'http://www.bbc.co.uk/radio/player/bbc_6music'
	});
};
