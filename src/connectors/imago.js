'use strict';

Connector.playerSelector = '.now-play';

Connector.artistTrackSelector = '#current-track';

Connector.isPlaying = () => $('.play-icon.stop').length === 0;

Connector.pauseButtonSelector = '.play-icon.stop';
