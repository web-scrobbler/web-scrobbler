'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'http://music.163.com/#/playlist?id=374012053'
	});
};
