'use strict';

/* global connectorSpec */

module.exports = function(driver) {
	connectorSpec.loadPlayListen(driver, {
		url: 'https://www.youtube.com/watch?v=YqeW9_5kURI'
	});
};
