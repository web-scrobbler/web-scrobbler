'use strict';

module.exports = (driver, spec) => {
	spec.shouldContainPlayerElement(driver, {
		url: 'https://music.douban.com/artists/player/?sid=67660'
	});
};
