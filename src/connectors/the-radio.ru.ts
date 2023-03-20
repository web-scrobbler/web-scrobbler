'use strict';

Connector.playerSelector = '.pla';

Connector.artistSelector = '.pla-artist';

Connector.trackSelector = '.pla-song';

Connector.isPlaying = () => $('.pla-ava').hasClass('pla-ava--vinyl');
