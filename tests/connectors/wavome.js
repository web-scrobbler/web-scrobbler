'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://wavo.me/adventureclub/wonder-remix-competition',
		playButtonSelector: '.pulse-hover-btn-wrapper.play-wrapper'
	});
};
