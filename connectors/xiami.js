'use strict';

/* global Connector */

Connector.playerSelector = '#player-main';

Connector.trackSelector = '#J_trackInfo a:first';

Connector.albumSelector = '.ui-track-current .ui-track-main  .ui-row-item-body .c3 > a';

Connector.artistSelector = '#J_trackInfo a:nth-child(2)';

Connector.playButtonSelector = '#J_playBtn';

Connector.currentTimeSelector = '#J_positionTime';

Connector.trackArtSelector = '#J_playerCoverImg';

Connector.durationSelector = '#J_durationTime';

Connector.isPlaying = function () {
	return $('#J_playBtn').hasClass('pause-btn');
};
