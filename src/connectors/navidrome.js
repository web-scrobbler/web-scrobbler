'use strict';

const artistAlbumSeparator = ' - ';
const artistAlbumSelector = '.songInfo';

Connector.playerSelector = '.music-player-panel';

Connector.trackSelector = '.songTitle';

Connector.trackArtSelector = '.img-content';

Connector.currentTimeSelector = '.current-time';

Connector.durationSelector = '.duration';

Connector.getTrackInfo = () => {
	const artistAlbum = Util.getTextFromSelectors(artistAlbumSelector);
	return Util.splitArtistAlbum(artistAlbum, [artistAlbumSeparator]);
};

Connector.isPlaying = () => {
	return document.querySelector('.img-rotate-pause') === null;
};
