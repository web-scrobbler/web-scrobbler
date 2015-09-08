module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'http://edm.com/tracks/megalodon-virtual-riot-fatal-fist-punch-premiere',
		'.track-control-holder'
	);

};
