'use strict';

Connector.playerSelector = '.controls';

Connector.artistTrackSelector = '.controls .scroll-title';

Connector.isPlaying = () => $('.controls .fa-pause').length > 0;
