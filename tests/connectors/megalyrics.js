'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://megalyrics.ru/about/ziemfira.htm',
		playButtonSelector: '.play-all .play'
	});
};
