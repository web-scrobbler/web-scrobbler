'use strict';

const ARTISTALBUM_SEPARATOR = '-';

const artistAlbumSelector = '.playerinfo-lhs .light-text-color';

Connector.playerSelector = '.player';

Connector.pauseButtonSelector = '.playerControls .spause';

Connector.currentTimeSelector = '.timeUpdate .timeStart';

Connector.durationSelector = '.timeUpdate .timeEnd';

Connector.trackSelector = '.playerinfo-lhs .dark-text-color';

Connector.getTrackInfo = () => {
	const artistAlbum = Util.getTextFromSelectors(artistAlbumSelector);
	const [artist, album] = Util.splitString(
		artistAlbum, [ARTISTALBUM_SEPARATOR]
	);

	return { artist, album };
};
