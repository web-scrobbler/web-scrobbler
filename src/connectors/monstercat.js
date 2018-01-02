'use strict';

Connector.playerSelector = '.controls';

Connector.artistTrackSelector = '.scroll-title';

Connector.isPlaying = () => $('.controls .fa-pause').length > 0;
