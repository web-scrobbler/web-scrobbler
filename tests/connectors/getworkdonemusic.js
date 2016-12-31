'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.getworkdonemusic.com/',
		playButtonSelector: '.sc-remote-link'
	});
};
