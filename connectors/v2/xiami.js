'use strict';

/* global Connector */

Connector.playerSelector = '#player-main';

Connector.trackSelector = '#J_trackInfo a:first';

Connector.albumSelector = '.ui-track-current .ui-track-main  .ui-row-item-body .c3 > a';

Connector.artistSelector = '#J_trackInfo a:nth-child(2)';

Connector.playButtonSelector = '#J_playBtn';

Connector.currentTimeSelector = '#J_positionTime';

Connector.trackArtImageSelector = '#J_playerCoverImg';

Connector.getDuration = function () {
	var totalSecondValue = $('#J_durationTime').text(), duration = '';
	if (totalSecondValue) {
		duration = +totalSecondValue.split(':')[0]*60 + (+totalSecondValue.split(':')[1]);
	}
	return duration;
};

Connector.isPlaying = function () {
	return $('#J_playBtn').hasClass('pause-btn');
};
