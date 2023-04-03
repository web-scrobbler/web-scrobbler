export {};

Connector.playerSelector = '.playerinfo';

Connector.artistSelector = '.playerinfo__artist';

Connector.trackSelector = '.playerinfo__title';

Connector.trackArtSelector = '.playerinfo__cover img';

Connector.isPlaying = () => Util.hasElementClass('.dfm-play', 'is-playing');
