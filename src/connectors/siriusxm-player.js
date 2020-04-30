'use strict';

/*
 * On some "decade" stations SiriusXM appends the last two digits
 * of the release year to the song title like this: Where Is The Love (03).
 *
 * This filter removes such suffixes.
 */

const filter = new MetadataFilter({ track: removeYear });
const removeYearRe = /\s\(\d{2}\)\s?$/g;

const playButtonSelector = '.sxm-player-controls .play-pause-btn';

Connector.playerSelector = '.sxm-player-controls';

Connector.artistSelector = '.sxm-player-controls .artist-name';

Connector.trackSelector = '.sxm-player-controls .track-name';

Connector.isPlaying = () => {
	return Util.getAttrFromSelectors(playButtonSelector, 'title') === 'Pause';
};

Connector.trackArtSelector = '.album-image-cell img';

Connector.isScrobblingAllowed = () => {
	const artist = Connector.getArtist();
	if (artist) {
		return !artist.toLowerCase().includes('siriusxmu');
	}

	return false;
};

Connector.applyFilter(filter);

function removeYear(track) {
	return track.replace(removeYearRe, '');
}
