'use strict';

Connector.playerSelector = '#player';

Connector.artistTrackSelector = '.track-meta > h5';

Connector.isPlaying = () => $('.vjs-play-control').hasClass('vjs-playing');
