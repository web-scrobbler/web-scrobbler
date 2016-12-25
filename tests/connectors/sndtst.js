'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://sndtst.com/Battle_Garegga',
		playButtonSelector: '#ActionPlay'
	});
};
