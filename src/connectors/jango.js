'use strict';

const trackInfoSelector = '#album_info .m:first-child';

Connector.playerSelector = '#player-outer-box';

Connector.trackSelector = '#song_info span';

Connector.trackArtSelector = '#player_pics a';

Connector.getTrackInfo = () => {
	let artist = null;
	let album = null;

	const trackInfoEl = document.querySelector(trackInfoSelector);
	if (trackInfoEl) {
		const trackInfo = trackInfoEl.childNodes || [];
		if (trackInfo.length === 4) {
			album = trackInfo[3].textContent;
		}
		artist = trackInfo[1].textContent;
	}

	return { artist, album };
};

Connector.pauseButtonSelector = '.player_pause';
