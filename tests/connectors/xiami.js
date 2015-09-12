module.exports = function(driver, connector, next) {

	helpers.devInfo("Xiami is not globally accessible - cannot reliably test for load");
	next();

	// connectorSpec.loadPlayListen(driver, next,
	// 	'http://www.xiami.com/play',
	// 	'#J_nextBtn'
	// );

};
