'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://bandzone.cz/trautenberk',
		playButtonSelector: '.ui-audioplayer-button'
	});
};
