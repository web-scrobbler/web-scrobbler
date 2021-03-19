'use strict';

Connector.playerSelector = 'player';
Connector.artistSelector = 'cover-with-info.current.cover artist-names div.value';
Connector.trackSelector = 'cover-with-info.current.cover div.title-content > span.title';

Connector.onReady = Connector.onStateChanged;
