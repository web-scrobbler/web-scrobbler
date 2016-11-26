'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.farfrommoscow.com/',
		playButtonSelector: '.player-buttonPlay'
	});
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.farfrommoscow.com/artists/life-on-marx.html',
		playButtonSelector: '.player-buttonPlay'
	});
};
