'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.jiosaavn.com/s/album/hindi/OK-Jaanu-2017/oOcDUteu9SA_',
		playButtonSelector: 'button.play'
	});
};
