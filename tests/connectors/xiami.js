'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.xiami.com/play?ids=/song/playlist/id/1020552829/type/1#loaded'
	});
};
