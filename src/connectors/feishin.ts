export {};

Connector.playerSelector = '.media-player';

Connector.trackSelector = '.song-title';

Connector.artistSelector = '.song-artist';

Connector.albumSelector = '.song-album';

Connector.currentTimeSelector = '.elapsed-time';

Connector.trackArtSelector = '.player-cover-art';

Connector.durationSelector = '.total-duration';

Connector.isPlaying = () => {
	return Util.isElementVisible('.player-state-playing');
};
