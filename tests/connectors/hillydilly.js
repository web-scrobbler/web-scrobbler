'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.hillydilly.com/',
		playButtonSelector: '.appPlayer__play'
	});
};
