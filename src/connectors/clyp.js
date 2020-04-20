'use strict';

Connector.playerSelector = '#player-page';

Connector.artistSelector = '.user-summary-name';

Connector.trackSelector = '.audio-file-title';

Connector.isPlaying = () => $('.soundwave-container').first().hasClass('.pause-button');
