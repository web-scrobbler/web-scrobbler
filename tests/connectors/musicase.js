module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'https://www.musicload.de/web/single?id=12518819',
		'.single-detail .actions'
	);

};
