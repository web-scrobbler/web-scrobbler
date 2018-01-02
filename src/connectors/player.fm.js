'use strict';

Connector.playerSelector = '.miniplayer';

Connector.artistSelector = '.current-series-link';

Connector.trackSelector = '.current-episode-link';

Connector.isPlaying = () => $('.jp-pause').is(':visible');
