'use strict';

Connector.playerSelector = '#app';

Connector.artistSelector = '.playerContainer.columns.mini .player .player-song-artist';

Connector.trackSelector = '.playerContainer.columns.mini .player .player-song-title';

Connector.isPlaying = () => $('.icon-music-pause-a').length > 0;
