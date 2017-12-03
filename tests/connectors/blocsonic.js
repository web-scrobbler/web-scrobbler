'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://blocsonic.com/',
		playButtonSelector: '.spicon'
	});
};
