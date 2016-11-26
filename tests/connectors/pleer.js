'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://pleer.net/tracks/44662018SBp',
		playButtonSelector: '.i-play'
	});
};
