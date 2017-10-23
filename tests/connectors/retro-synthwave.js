'use strict';

module.exports = (driver, spec) => {
	spec.shouldContainPlayerElement(driver, {
		url: 'http://www.retro-synthwave.com/music/synthwaves-universe'
	});
};
