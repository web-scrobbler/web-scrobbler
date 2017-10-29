'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'https://www.radiojavan.com/mp3s/mp3/Raam-Tabeede-Ejbari'
	});
};
