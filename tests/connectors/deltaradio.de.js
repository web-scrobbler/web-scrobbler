'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.deltaradio.de/?startChannel=3',
		playButtonSelector: '.recaster-mainBt'
	});
};
