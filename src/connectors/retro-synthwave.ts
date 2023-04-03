export {};

Connector.playerSelector = '#scamp_player';

Connector.artistSelector = '.sp-track-artist';

Connector.trackSelector = '.sp-track-title';

Connector.trackArtSelector = '.sp-track-artwork';

Connector.currentTimeSelector = '.sp-player-container .sp-time-elapsed';

Connector.durationSelector = '.sp-player-container .sp-time-total';

Connector.isPlaying = () => Util.hasElementClass('#scamp_player', 'playing');
