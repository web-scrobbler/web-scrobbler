module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'http://listen.tidal.com/album/50767183',
		'.album-header__playbutton'
	);

};
