module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'http://www.xiami.com/play',
		'#J_nextBtn'
	);

};
