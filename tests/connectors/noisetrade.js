'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://noisetrade.com/andrewgalucki/im-not-going-anywhere',
		playButtonSelector: '.jp-playlist-item'
	});
};
