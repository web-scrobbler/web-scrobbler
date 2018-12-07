'use strict';

module.exports = (driver, spec) => {
	spec.shouldContainPlayerElement(driver, {
		url: 'https://y.qq.com/portal/player.html'
	});
};
