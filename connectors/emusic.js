'use strict';

Connector.playerSelector = '.player';

Connector.getArtistTrack = () => {
	let aElem = $('.track__meta-data a');
	let artist = aElem[0].textContent;
	let track = aElem[2].textContent;


	return { artist, track };
};

Connector.playButtonSelector = '.player__play__button';

Connector.currentTimeSelector = '.track__time.float-left';

Connector.durationSelector = '.track__time.float-right';

Connector.trackArtSelector = '.preloadImage';
