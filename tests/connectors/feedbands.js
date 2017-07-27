'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://feedbands.com/sovietdolls2/ghostlover-2',
		playButtonSelector: '#btn_play_song_info_feed_href'
	});
};
