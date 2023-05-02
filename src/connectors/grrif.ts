export {};

Connector.playerSelector = '.pg-content-player';

Connector.trackSelector = '.pg-title';

Connector.artistSelector = '.pg-artiste';

Connector.isPlaying = () => Util.hasElementClass('#kast-play', 'kast-playing');

Connector.trackArtSelector = '.pg-history .onair img';

Connector.isTrackArtDefault = (url) => url?.includes('default');
