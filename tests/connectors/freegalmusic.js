'use strict';

module.exports = (driver, spec) => {
	spec.shouldLoadWebsite(driver, {
		url: 'https://www.freegalmusic.com/'
	});
};
