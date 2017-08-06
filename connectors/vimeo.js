'use strict';

Connector.playerSelector = '.player';

Connector.artistTrackSelector = '.clip_main-content h1';

Connector.getCurrentTime = () => {
	let currentTimeStr = $('div.played').attr('aria-valuenow');
	return parseFloat(currentTimeStr);
};

Connector.getDuration = () => {
	let durationStr = $('div.played').attr('aria-valuemax');
	return parseFloat(durationStr);
};

Connector.getUniqueID = () => $('.player').attr('id');

Connector.isPlaying = () => {
	return $('.play').hasClass('state-playing');
};

Connector.filter = MetadataFilter.getYoutubeFilter();
