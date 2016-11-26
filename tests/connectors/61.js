'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.thesixtyone.com/',
		playButtonSelector: '#miniplayer_controls .play_button'
	});
};
