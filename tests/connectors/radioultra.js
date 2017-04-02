'use strict';

module.exports = (driver, spec) => {
	let urls = [
		'http://player.radiojazzfm.ru/',
		'http://player.radioultra.ru/',
		'http://player.rockfm.ru/',
		'http://player.bestfm.ru/',
		'http://player.nashe.ru/',
	];
	let playButtonSelector = '.jp-play';

	for (let url of urls) {
		spec.shouldBehaveLikeMusicSite(driver, {
			url, playButtonSelector
		});
	}
};
