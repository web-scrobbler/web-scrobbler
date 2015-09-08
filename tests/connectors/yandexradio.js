module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'https://radio.yandex.ru/author/plushev',
		'.player-controls__play'
	);

};
