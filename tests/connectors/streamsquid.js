'use strict';

module.exports = (driver, spec) => {
	spec.shouldContainPlayerElement(driver, {
		url: 'http://streamsquid.com/'
	});
};
