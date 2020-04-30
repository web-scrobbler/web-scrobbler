'use strict';

const artistTrackRe = /(.+?)《(.+?)》/;
const containerSelector = '.container_player';

Connector.playerSelector = containerSelector;

Connector.playButtonSelector = `${containerSelector} .txp_controls [data-status="play"]`;

Connector.getArtistTrack = () => {
	return extractArtistTrack(Util.getTextFromSelectors('.video_title'));
};

// Example: 周华健《朋友》(KTV版)
function extractArtistTrack(artistTrackStr) {
	if (artistTrackStr) {
		const match = artistTrackStr.match(artistTrackRe);
		if (match) {
			return { artist: match[1], track: match[2] };
		}
	}

	return null;
}
