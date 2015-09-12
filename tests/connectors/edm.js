module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'http://edm.com/tracks/megalodon-virtual-riot-fatal-fist-punch-premiere',
		'.track-control-holder a[ng-click]',
		{'load': {'timeout': 30000 }} // Buggy site takes ages to load, needs extra time before the connector can init
	);

};
