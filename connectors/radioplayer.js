'use strict';

const artistTrackSelectors = [
	'.song-text', '.scrolling-text'
];

Connector.playerSelector = '.radioplayer-head';

Connector.playButtonSelector = '#play';

Connector.getArtistTrack = () => {
	for (let selector of artistTrackSelectors) {
		if ($(selector).length > 0) {
			return Util.splitArtistTrack($(selector).text());
		}
	}

	return Util.makeEmptyArtistTrack();
};
