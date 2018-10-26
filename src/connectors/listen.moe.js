'use strict';

Connector.playerSelector = '#app';

Connector.artistSelector = '.playerContainer.columns.mini .player .player-song-artist';
Connector.trackSelector = '.playerContainer.columns.mini .player .player-song-title';

Connector.getArtistTrack = () => {
	//Tag fix, because most of the songs are not recognized because they have a weird naming scheme: title [ANIME-name]
	return $('.player-song-title')[0].innerText.split(' [')[0];
};

Connector.getArtist = () => {
	//Tag fix, because else not recognized most of the time!
	return $('.player-song-artist-container')[0].innerText.replace(" ,", ",");
};

Connector.isPlaying = () => $('.icon-music-pause-a') !== null;
