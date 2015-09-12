module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'http://ghostly.com/discovery/play',
		'.button'
	);

};
