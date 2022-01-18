'use strict';

const artistAlbumSeparator = ' - ';
const artistAlbumSelector = '.songTitle';

Connector.playerSelector = '.music-player-panel';

Connector.trackSelector = '.songTitle';

Connector.artistSelector = '.songArtist';

Connector.albumSelector = '.songAlbum';

Connector.trackArtSelector = '.img-content';

Connector.currentTimeSelector = '.current-time';

Connector.durationSelector = '.duration';

Connector.isPlaying = () => {
	return document.querySelector('.img-rotate-pause') === null;
};
