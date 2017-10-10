'use strict';

module.exports = (driver, spec) => {
	spec.shouldContainPlayerElement(driver, {
		url: 'http://www.kugou.com/song/#hash=5B332623D82BFFA39BE2D806837F2E52&album_id=2539778'
	});
};
