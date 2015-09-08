module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'https://www.radionomy.com/en/radio/foofightersfanloopradio/index',
		'.radioPlayBtn'
	);

};
