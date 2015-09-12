module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'https://wavo.me/galeksandrp/my-playlist',
		'.play'
	);

};
