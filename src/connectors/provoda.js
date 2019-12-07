'use strict';

Connector.playerSelector = '#player-logo';

Connector.artistTrackSelector = '#track';

Connector.isPlaying = () => $('#player-control-playing').css('display') === 'inline';
