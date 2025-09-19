export {};
Connector.playerSelector = '#now-playing-bar';

Connector.artistSelector = '#player-track-artist';

Connector.trackSelector = '#player-track-title';

Connector.albumSelector = '#now-playing-bar #web-scrobbler-album';

Connector.albumArtSelector = '#player-art-img';

Connector.isPlaying = () =>
	document.querySelector('#play-pause-btn')?.classList.contains('playing');

Connector.id = 'creamer-nation';
Connector.label = 'CREAMER NATION';
Connector.match = 'creamer.nation';
