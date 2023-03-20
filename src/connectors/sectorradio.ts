'use strict';

Connector.playerSelector = '.player';

Connector.artistSelector = '.player__title';

Connector.trackSelector = '.player__trackname';

Connector.isPlaying = () => $('#play').hasClass('pause');
