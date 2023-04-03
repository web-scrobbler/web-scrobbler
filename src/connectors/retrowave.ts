export {};

Connector.playerSelector = '.theme__container';

Connector.artistTrackSelector = '#display-title';

Connector.durationSelector = '#display-time-total';

Connector.trackArtSelector = '#player-cover';

Connector.isPlaying = () => !Util.hasElementClass('#player', 'player_paused');
