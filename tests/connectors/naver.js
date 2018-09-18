'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'https://playerui.music.naver.com/'
	});
};
