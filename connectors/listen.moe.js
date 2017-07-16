'use strict';

Connector.playerSelector = '.container';

Connector.artistTrackSelector = '.title:first';

Connector.isPlaying = () => $('.player-icon').attr('id') === 'pause';
