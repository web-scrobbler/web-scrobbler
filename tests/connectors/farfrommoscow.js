module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'http://www.farfrommoscow.com/artists/phooey.html',
		'#musicbox > :nth-child(3) .player-buttonPlay'
	);

};
