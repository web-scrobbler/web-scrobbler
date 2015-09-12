module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'https://www.jamendo.com/ru/track/1258976/liquid-blue',
		'.jamactionbutton.listen'
	);

};
