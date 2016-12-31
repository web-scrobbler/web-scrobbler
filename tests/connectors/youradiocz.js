'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.youradio.cz/',
		playButtonSelector: '.yr2-bubble'
	});
};
