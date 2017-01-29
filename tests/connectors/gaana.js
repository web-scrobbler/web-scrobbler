'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://gaana.com/album/rustom',
		playButtonSelector: '#p-list-play_all'
	});
};
