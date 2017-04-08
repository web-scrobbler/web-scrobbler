'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://mycloudplayers.com/',
		playButtonSelector: '.play'
	});
};
