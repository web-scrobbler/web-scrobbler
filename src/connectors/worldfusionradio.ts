export {};

Connector.playerSelector = '.radio-player';

Connector.artistTrackSelector = '.radio-player-song-title';

Connector.isPlaying = () => Util.hasElementClass('.radio-play-pause', 'active');
