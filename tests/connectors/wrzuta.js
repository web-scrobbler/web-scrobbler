'use strict';

module.exports = function(driver, connectorSpec) {
	// Test playing a playlist
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://lalanablanalala91.wrzuta.pl/playlista/5WQ44bqPAR0/napszyklat_-_np_2009',
		playButtonSelector: '.controls-play'
	});

	// Test playing a single video
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://noname925.wrzuta.pl/audio/60e3sP4UTY0/thomas_gold_feat._bright_lights_-_believe',
		playButtonSelector: '.clickToOpenInfo'
	});
};
