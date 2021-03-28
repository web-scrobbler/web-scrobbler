'use strict';

Connector.playerSelector = '.player';
Connector.trackArtSelector = '.player-image';
Connector.trackSelector = '.track-name';
Connector.artistSelector = '.track-artist';

Connector.isPlaying = () => Util.hasElementClass('.playing-indicator', 'is-playing');
