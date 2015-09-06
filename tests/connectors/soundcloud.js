module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'https://soundcloud.com/travisscott-2/travis-scott-antidote',
		'.heroPlayButton.sc-button.sc-button-hero'
	);

};
