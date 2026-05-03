export {};
Connector.playerSelector = '#now-playing-bar';

Connector.artistSelector = '#player-track-artist';

Connector.trackSelector = '#player-track-title';

Connector.albumSelector = '#now-playing-bar #web-scrobbler-album';

Connector.trackArtSelector = '#player-art-img';

Connector.isPlaying = () => Util.hasElementClass('#play-pause-btn', 'playing');
