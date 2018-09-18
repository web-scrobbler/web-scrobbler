'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'https://music.bugs.co.kr/newPlayer?trackId=4745563&autoplay=true&html5=true'
	});
};
