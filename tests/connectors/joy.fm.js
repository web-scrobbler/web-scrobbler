'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://myradiomatic.com/player/joyfm/player.htm',
	});
};
