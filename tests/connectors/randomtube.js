'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://youtube-playlist-randomizer.valami.info/playlist3.php?pl=PLDfKAXSi6kUaSYVckUxaN1P3rL4GIPim0'
	});
};
