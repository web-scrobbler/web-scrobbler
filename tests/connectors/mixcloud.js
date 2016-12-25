'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.mixcloud.com/the264cru/the-comedown-059-ase-madstarbase/'
	});
};
