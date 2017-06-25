'use strict';

/* global Connector */

Connector.playerSelector = 'body';

Connector.artistSelector = '.now_playing .artist';

Connector.trackSelector = '.now_playing .title';

Connector.albumSelector = '.now_playing .album';

Connector.trackArtSelector = '.now_playing .art_container';

Connector.isPlaying = () => $('#r4_audio_player').hasClass('playing');
