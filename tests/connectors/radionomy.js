'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.radionomy.com/en/radio/100-hit-radio/index',
		playButtonSelector: '.radioPlayBtn'
	});
};
