module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'http://www.piter.fm/stations/FM_100.5',
		'#player-container'
	);

};
