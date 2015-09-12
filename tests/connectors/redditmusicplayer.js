module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'https://reddit.musicplayer.io/',
		'.item.play.button'
	);

};
