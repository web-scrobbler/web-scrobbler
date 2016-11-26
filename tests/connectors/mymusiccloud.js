'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.mymusiccloud.com/app/store/albumDetails/7DUS_5813364',
		playButtonSelector: '.albumDetailTrackPlayIcon'
	});
};
