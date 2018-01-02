'use strict';

Connector.playerSelector = '#playerControls';

Connector.artistTrackSelector = '#videoTitle';

Connector.isPlaying = () => $('.ui-slider-range').width() > 0;
