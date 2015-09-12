module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'http://solayo.com/media/217602371soundcloud',
		'.playNow'
	);

};
