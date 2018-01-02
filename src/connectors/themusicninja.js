'use strict';

Connector.playerSelector = '#player_inside_wrapper';

Connector.isPlaying = () => $('#player-features').hasClass('tmn_playing');

Connector.artistSelector = '#track_title .artist';

Connector.trackSelector = '#track_title .title';

Connector.currentTimeSelector = '#player-features .sm2_position';

Connector.durationSelector = '#player-features .sm2_total';
