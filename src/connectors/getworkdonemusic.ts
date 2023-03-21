export {};

Connector.playerSelector = '.container';

Connector.trackArtSelector = '.playing .active img';

Connector.artistTrackSelector = '.playing .sc-title';

Connector.isPlaying = () => Util.hasElementClass('.sc-remote-link', 'playing');
