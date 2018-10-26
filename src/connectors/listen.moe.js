'use strict';

Connector.playerSelector = '#app';

Connector.artistSelector = '.playerContainer.columns.mini .player .player-song-artist';
Connector.trackSelector = '.playerContainer.columns.mini .player .player-song-title';

Connector.getArtistTrack = () => {
	return $('.player-song-title')[0].innerText.split(' [')[0];
};

Connector.getArtist = () => {
	return $('.player-song-artist-container')[0].innerText.replace(" ,", ",");
};

Connector.isPlaying = () => $('.icon-music-pause-a') !== null;
