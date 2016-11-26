'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.themusicninja.com/wednesday-workout-playlist-vol-8/',
		playButtonSelector: '.ninja_player'
	});
};
