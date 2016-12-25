
'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'http://play.baidu.com/?__m=mboxCtrl.addSong&__a=277291990'
	});
};
