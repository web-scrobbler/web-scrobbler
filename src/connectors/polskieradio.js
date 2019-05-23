'use strict';

Connector.playerSelector = '#cM';

Connector.artistSelector = '.present .artist';

Connector.trackSelector = '.present .title';

Connector.isPlaying = () => $('#jwPlay').hasClass('pause');
