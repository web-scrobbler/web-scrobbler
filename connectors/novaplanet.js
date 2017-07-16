'use strict';

Connector.playerSelector = '.radio-radionova';

Connector.artistSelector = '.artist';

Connector.trackSelector = '.ontheair-text .title';

Connector.isPlaying = () => $('.btn_pause').is(':visible');
