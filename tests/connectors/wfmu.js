'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://wfmu.org/audioplayer/?p=http://stream0.wfmu.org/freeform-128k&t=Pseu%27s%20Thing%20With%20A%20Hook&song=%5Bobject%20Object%5D&currentStream=WFMU%20Live%20Stream'
	});
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://wfmu.org/archiveplayer/?show=75767&archive=156644&starttime='
	});
};
