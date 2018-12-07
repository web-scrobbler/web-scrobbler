'use strict';

module.exports = (driver, spec) => {
	// Default player
	spec.shouldContainPlayerElement(driver, {
		url: 'http://www.kuwo.cn/'
	});

	// Single player
	spec.shouldContainPlayerElement(driver, {
		url: 'http://www.kuwo.cn/yinyue/1224019'
	});

	// Mobile player
	spec.shouldContainPlayerElement(driver, {
		url: 'http://m.kuwo.cn/newh5/singles/content?mid=1224019%2028803014'
	});
};
