module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'https://www.stereodose.com/user_playlist/25616/molecules-of-light',
		'.jp-next'
	);

};
