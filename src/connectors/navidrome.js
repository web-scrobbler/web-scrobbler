'use strict';

const artistAlbumSeparator = ' - ';
const artistAlbumSelector = '.songTitle';

Connector.playerSelector = '.music-player-panel';

Connector.trackSelector = '.songTitle';

Connector.trackArtSelector = '.img-content';

Connector.currentTimeSelector = '.current-time';

Connector.durationSelector = '.duration';

Connector.getTrackInfo = () => {
	const artistAlbumYear = document.querySelector(artistAlbumSelector).parentNode.nextSibling.innerText;
	const [artist, album] = artistAlbumYear.split(artistAlbumSeparator, 2);
	return { artist, album };
};

Connector.isPlaying = () => {
	return document.querySelector('.img-rotate-pause') === null;
};
