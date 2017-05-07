'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://radd.it/music',
		playButtonSelector: '.details'
	});
};
