'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://londonbu.fastcast4u.com/',
		playButtonSelector: '.control .play'
	});
};
