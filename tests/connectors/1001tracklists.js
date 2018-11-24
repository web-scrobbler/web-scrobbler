'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.1001tracklists.com/tracklist/f6p53pk/armin-van-buuren-m.i.k.e.-push-a-state-of-trance-883-2018-09-27.html',
		playButtonSelector: '#tlp_play_3616732'
	});
};
