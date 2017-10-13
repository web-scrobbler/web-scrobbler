'use strict';

module.exports = (driver, spec) => {
	// Default player
	spec.shouldContainPlayerElement(driver, {
		url: 'http://www.1ting.com/player/81/player_959082.html'
	});

	// Day player
	spec.shouldContainPlayerElement(driver, {
		url: 'http://www.1ting.com/day/2017-08-03/3499.html'
	});

	// H5 player
	spec.shouldContainPlayerElement(driver, {
		url: 'http://h5.1ting.com/#/rank/europeamerica'
	});
};
