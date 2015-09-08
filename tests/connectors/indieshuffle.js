module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'http://www.indieshuffle.com/wennink-dissolve/',
		'.main-review .figure.commontrack'
	);

};
