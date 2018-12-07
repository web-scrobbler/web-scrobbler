'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://plaza.one/',
		playButtonSelector: '.player-play'
	});
};
