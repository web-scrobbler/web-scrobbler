'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'http://relaxingbeats.com'
	});
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'http://epicmusictime.com'
	});
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'http://www.jazzandrain.com'
	});
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'http://holidaychristmasmusic.com/'
	});
};
