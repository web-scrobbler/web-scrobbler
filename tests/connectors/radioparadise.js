'use strict';

module.exports = function(driver, connectorSpec) {
	// Strange play control elements
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'https://www.radioparadise.com/rp_2.php?#song_id=35428&mode=web'
	});
};
