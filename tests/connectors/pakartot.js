'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.pakartot.lt/album/juoda-ruda-singlas',
		playButtonSelector: '.play-release'
	});
};
