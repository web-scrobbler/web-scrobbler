'use strict';

const ARTISTALBUM_SEPARATOR = '—';

const artistAlbumSelector = '.web-chrome-playback-lcd__sub-copy-scroll-inner-text-wrapper';

Connector.playerSelector = '.web-chrome';

Connector.currentTimeSelector = '#apple-music-current-playback-time';

Connector.remainingTimeSelector = '#apple-music-current-playback-time-remaining';

Connector.trackSelector = '.web-chrome-playback-lcd__song-name-scroll-inner-text-wrapper';

Connector.getTrackInfo = () => {
	const artistAlbum = Util.getTextFromSelectors(artistAlbumSelector);
	return Util.splitArtistAlbum(artistAlbum, [ARTISTALBUM_SEPARATOR]);
};

Connector.pauseButtonSelector = '.is-playing';
