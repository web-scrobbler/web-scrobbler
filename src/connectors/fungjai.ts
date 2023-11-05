export {};

Connector.artistSelector = '.track-label .artist-name';

Connector.trackSelector = '.track-label .track-name';

Connector.playerSelector = '.fp-controls';

Connector.isPlaying = () => Util.hasElementClass('#mixed', 'is-playing');
