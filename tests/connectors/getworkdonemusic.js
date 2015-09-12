module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'http://getworkdonemusic.com/',
		'.sc-remote-link'
	);

};
