module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'http://slashfavorites.com/#jon-kyle',
		'.refresh'
	);

};
