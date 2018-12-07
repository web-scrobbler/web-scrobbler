'use strict';

Connector.playerSelector = '.c-player';

Connector.artistTrackSelector = '.c-track-detail__label > h4';

Connector.isPlaying = () => $('audio[playsinline]').length > 0;
