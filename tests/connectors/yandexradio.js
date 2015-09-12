module.exports = function(driver, connector, next) {

	helpers.devInfo("Yandex is not globally accessible - cannot reliably test for load");
	next();

	// connectorSpec.loadPlayListen(driver, next,
	// 	'https://radio.yandex.ru/author/plushev',
	// 	'.player-controls__play'
	// );

};
