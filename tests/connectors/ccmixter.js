'use strict';

module.exports = (driver, spec) => {
	spec.shouldLoadWebsite(driver, {
		url: 'http://ccmixter.org/view/media/remix'
	});
};
