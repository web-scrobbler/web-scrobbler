'use strict';

Connector.playerSelector = '.pla';

Connector.artistSelector = '.pla-artist';

Connector.trackSelector = '.pla-song';

Connector.isPlaying = () => Util.hasElementClass('.pla-control .pla-ava', 'pla-ava--vinyl');
