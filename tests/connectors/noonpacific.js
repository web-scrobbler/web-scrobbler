'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://noonpacific.com/',
		playButtonSelector: '.audio-player__play .fa-play'
	});

	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://collection.noonpacific.com/slowtide/#?track=Beachwood%20Sparks%20-%20%20Forget%20the%20Song',
		playButtonSelector: '#player .mb2.butt-circle'
	});

	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://collection.noonpacific.com/spacejams/',
		playButtonSelector: '.controls .play'
	});


};
