'use strict';

Connector.playerSelector = '#player-section';

Connector.artistTrackSelector = '.fp-title';

Connector.isPlaying = () => $('.fp-playbtn').prop('title') === 'Pause';

Connector.currentTimeSelector = '.fp-elapsed';

Connector.durationSelector = '.fp-duration';
