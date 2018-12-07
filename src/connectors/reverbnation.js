'use strict';

Connector.playerSelector = '#music_player';

Connector.artistSelector = '[data-role="artist"]';

Connector.trackSelector = '[data-role="title"]';

Connector.isPlaying = () => $('.btn_pause').is(':visible');
