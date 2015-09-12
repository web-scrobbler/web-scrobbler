module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'http://www.novoeradio.by/',
		'.button-play'
	);

};
