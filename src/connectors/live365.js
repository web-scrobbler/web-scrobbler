'use strict';

Connector.playerSelector = '.now-playing';
Connector.trackArtSelector = '.track-item img';
Connector.trackSelector = '.track-title';
Connector.artistSelector = '.track-artist';

Connector.isPlaying = () => Util.hasElementClass('.playing-indicator', 'is-playing');
