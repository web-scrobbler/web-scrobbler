'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.classicalradio.com/classicalguitarworks'
	});

	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.jazzradio.com/mellowpianojazz'
	});

	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.radiotunes.com/lovemusic'
	});

	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.rockradio.com/alternativerock'
	});
};
