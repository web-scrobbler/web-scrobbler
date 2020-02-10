'use strict';

const ARTISTALBUM_SEPARATOR = '–';

const artistAlbumSelector = '.player .content .info .band-title';

Connector.currentTimeSelector = '.player div.timing:not(.duration) div:last-child';

Connector.durationSelector = '.player div.timing.duration div:last-child';

Connector.playerSelector = '.navigation > .player';

Connector.trackSelector = '.player .content .info .song-title';

Connector.getTrackInfo = () => {
	const artistAlbum = Util.getTextFromSelectors(artistAlbumSelector);
	const [artist, album] = Util.splitString(
		artistAlbum, [ARTISTALBUM_SEPARATOR]
	);

	return { artist, album };
};

Connector.isPlaying = () => {
	return $('.playpause .fas.fa-pause').length > 0;
};
