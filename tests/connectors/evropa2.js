'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://onair.europa2.sk',
		playButtonSelector: '.e2-player-control-skip'
	});
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://onair.europa2.sk',
		playButtonSelector: '.e2-player-control-skip'
	});
};
