'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.solayo.com/media/t4H_Zoh7G5Ayoutube',
		playButtonSelector: '.actionsBlock .playNow'
	});
};
