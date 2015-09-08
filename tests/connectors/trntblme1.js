module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'http://www.trntbl.me/fuckyeahqualitymusic',
		'#play-pause'
	);

};
