'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://8tracks.com/skyfeet/late-august',
		playButtonSelector: '#play_on_youtube'
	});
};
