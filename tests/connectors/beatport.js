'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.beatport.com/chart/life-sensations/408445',
		playButtonSelector: '.playable-play-all'
	});
};
