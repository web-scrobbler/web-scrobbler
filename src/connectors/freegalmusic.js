'use strict';

const filter = MetadataFilter.createFilter({
	artist: extractPrimaryArtist,
	track: [removeParody, removeRemaster],
});

Connector.playerSelector = '#player-section';

Connector.pauseButtonSelector = '.fp-playbtn[title=Pause]';

Connector.trackSelector = '.playlist-player ul > li.active-playlist-song';

Connector.durationSelector = '.fp-duration';

Connector.currentTimeSelector = '.fp-elapsed';

Connector.getArtist = () => {
	const artistTrackText = Util.getTextFromSelectors('.fp-message');

	if (artistTrackText) {
		// track title may be truncated or missing; only return artist
		return artistTrackText.split(' - ')[0];
	}

	return null;
};

Connector.isScrobblingAllowed = () => {
	return (
		Connector.getTrack() &&
		Util.isElementVisible(Connector.playerSelector) &&
		!Connector.getArtist().includes('Sorry, this song is not available')
	);
};

Connector.applyFilter(filter);

function extractPrimaryArtist(text) {
	// only return first artist if semicolon/comma-separated list of contributors
	return text.split(/(;|((?<!\d),))(?!\s)/)[0];
}

function removeParody(text) {
	return text.replace(/\s?\((Parody|Lyrical Adaption) of.*(\)|\.{3})/i, '');
}

function removeRemaster(text) {
	return text.replace(/\s?(\(|\[)[\s\w]*Remaster(ed)?[\s\w]*(\)|\]|\.{3})/gi, '');
}
