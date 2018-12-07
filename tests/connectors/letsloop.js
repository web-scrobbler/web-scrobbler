'use strict';

module.exports = (driver, connectorSpec) => {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://letsloop.com/artist/boards-of-canada/song/open-the-light',
		playButtonSelector: '#profile-pages-top > div > div.header-content-container > div > div.header-content-avatar > a'
	});
};
