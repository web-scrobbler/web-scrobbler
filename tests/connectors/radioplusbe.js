'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://radioplus.be/#/radio2-limburg/herbeluister',
		playButtonSelector: '.audio-controller a'
	});
};
