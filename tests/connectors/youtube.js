'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.youtube.com/watch?v=YqeW9_5kURI'
	});
};
