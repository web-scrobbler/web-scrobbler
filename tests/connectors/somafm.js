module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'http://somafm.com/player/#/all-stations',
		'#list > :first-child .glyphicon-play'
	);

};
