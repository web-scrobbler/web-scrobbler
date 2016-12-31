'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://freemusicarchive.org/search/',
		playButtonSelector: '.playbtn'
	});
};
