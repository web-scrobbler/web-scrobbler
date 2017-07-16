'use strict';

Connector.playerSelector = '#custom-jw-player-wrapper';

Connector.artistTrackSelector = '#jw-player-text';

Connector.isPlaying = () => $('#jw-play-button').text() === '';

Connector.currentTimeSelector = '#jw-current-time';

Connector.durationSelector = '#jw-total-time';
