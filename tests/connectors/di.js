'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.di.fm/futurebass',
		playButtonSelector: '.controls .tune-in'
	});
};
