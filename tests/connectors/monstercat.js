'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.monstercat.com/release/MCS532',
		playButtonSelector: '.fa-play-circle'
	});
};
