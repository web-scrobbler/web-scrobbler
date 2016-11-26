'use strict';

module.exports = function(driver, connectorSpec) {
	// Auth is required
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.deezer.com/artist/1',
		playButtonSelector: '.list-actions .btn-play'
	});
};
