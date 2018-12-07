'use strict';

Connector.playerSelector = '#player-controls';

Connector.artistSelector = '#player-nowplaying [href^="/artist/"]';

Connector.trackSelector = '#player-nowplaying [href^="/track/"]';

Connector.getTrackArt = () => {
	let styleProperty = $('.thumb').attr('style');
	return Util.extractUrlFromCssProperty(styleProperty);
};

Connector.getUniqueID = () => {
	let trackUrl = $('#player-nowplaying [href^="/track/"]').attr('href');
	if (trackUrl) {
		return trackUrl.split('/').pop();
	}
	return null;
};

Connector.isPlaying = () => $('#playerPlay').hasClass('pause');
