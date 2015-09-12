module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'https://bop.fm/s/the-weeknd/cant-feel-my-face',
		'.avatar'
	);

};
