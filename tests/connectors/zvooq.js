'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://zvooq.com/',
		playButtonSelector: '.topPanel-center .topPanelPlay'
	});
};
