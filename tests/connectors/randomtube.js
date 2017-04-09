'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'http://youtube-playlist-randomizer.valami.info/'
	});
};
