'use strict';

Connector.playerSelector = 'body';

Connector.artistSelector = 'h1';

Connector.trackSelector = '.jp-title';

Connector.isPlaying = () => $('.jp-pause').is(':visible');
