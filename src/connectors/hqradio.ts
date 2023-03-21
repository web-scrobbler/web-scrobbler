export {};

Connector.playerSelector = '#player';

Connector.artistTrackSelector = '#track .title';

Connector.trackArtSelector = '#disc .cover';

Connector.isPlaying = () => Util.hasElementClass('body', '_playing');
