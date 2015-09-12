module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'http://8tracks.com/action_hank/make-it-fun-kay',
		'#play_overlay'
	);

};
