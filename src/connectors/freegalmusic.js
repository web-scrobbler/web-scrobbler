'use strict';

Connector.playerSelector = '#player-section';

Connector.pauseButtonSelector = '.fp-playbtn[title=Pause]';

Connector.trackSelector = '.playlist-player ul > li.active-playlist-song';

Connector.getArtist = () => {
	const artistTrackText = Util.getTextFromSelectors('.fp-message');

	if (artistTrackText) {
		return artistTrackText.split(' - ')[0]; // track title may be truncated or missing; only return artist
	}

	return null;
};

Connector.durationSelector = '.fp-duration';

Connector.currentTimeSelector = '.fp-elapsed';

Connector.isScrobblingAllowed = () => {
	return (
		Connector.getTrack() &&
		Util.isElementVisible(Connector.playerSelector) &&
		!Connector.getArtist().includes('Sorry, this song is not available for streaming at this time')
	);
};

const filter = MetadataFilter.createFilter({
	artist: (text) => text.split(/(?<!\d),(?!\s)/g)[0], // only first artist if comma-separated list of contributors
});

Connector.applyFilter(filter);
