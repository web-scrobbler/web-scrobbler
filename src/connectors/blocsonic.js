'use strict';

Connector.playerSelector = '#sp-container';

Connector.isPlaying = () => 0 < $('.spi-pause-alt').length;

Connector.artistTrackSelector = '.sp-title';

Connector.currentTimeSelector = '.sp-time-position';

Connector.durationSelector = '.sp-length';
