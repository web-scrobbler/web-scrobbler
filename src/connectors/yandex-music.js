'use strict';

Connector.playerSelector = '.player-controls';

Connector.artistSelector = '.track_type_player .track__artists';

Connector.trackSelector = '.track_type_player .track__title';

Connector.currentTimeSelector = '.progress__left';

Connector.durationSelector = '.progress__right';

Connector.getUniqueID = () => {
	let trackUrl = $('.track_type_player .track__title').attr('href');
	if (trackUrl) {
		return trackUrl.split('/').pop();
	}
	return null;
};

Connector.isPlaying = () => {
	return $('.player-controls__btn_play').hasClass('player-controls__btn_pause');
};
