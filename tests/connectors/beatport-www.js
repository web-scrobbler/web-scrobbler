module.exports = function(driver, connector, next) {

	connectorSpec.loadPlayListen(driver, next,
		'https://www.beatport.com/spinninrecords/tracks/mapzt4k6tw6j/cream-original-mix',
		'.audio-control_large'
	);

};
