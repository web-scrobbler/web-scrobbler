export {};

/*
 * Station Meta Filter
 * - On some "decade" stations SiriusXM appends the last two digits
 * of the release year to the song title like this: Where Is The Love (03).
 * - On The Covers Channel, it adds Heroes (David Bowie Cover) to the track
 * - A lot of stations seem to employ adding EXCLUSIVE to the track name, so that is now removed
 *
 * Filter Station Meta
 * - There is now a filter for much of the station meta on SiriusXM. Removes social media handles, URLs, shownames
 */

const filter = MetadataFilter.createFilter({
	track: [removeYear, removeCover, removeExclusive],
});

Connector.playerSelector = "*[class^='_playbackControls_']";

Connector.artistTrackSelector =
	"*[class^='_playbackControls_'] *[class*='_title_']";

Connector.trackArtSelector =
	"*[class^='_playbackControls_'] *[class^='_trackImage_'] img[class^='_image-image']";

Connector.playButtonSelector =
	"*[class^='_playbackControls_'] button[aria-label='Play']";

Connector.pauseButtonSelector =
	"*[class^='_playbackControls_'] button[aria-label='Pause']";

Connector.scrobblingDisallowedReason = () => {
	const artist = Connector.getArtist()?.toLowerCase();
	const track = Connector.getTrack()?.toLowerCase();
	const filteredTerms = [
		'@siriusxm',
		'@jennylsq',
		'@radiomadison',
		'@morningmashup',
		'josiah',
		'1-877-33-sirius',
		'@sxm', // will broadly catch a bunch of sxm Twitter handles
		'altnation',
		'.ca',
		'.com',
		'indie 1.0',
		'#',
		'facebook',
		'twitter',
		'bdcast',
	];

	return filteredTerms.some(
		(term) => artist?.includes(term) || track?.includes(term),
	)
		? 'FilteredTag'
		: null;
};

Connector.applyFilter(filter);

function removeExclusive(track: string) {
	return track.replace(/\sEXCLUSIVE/g, '');
}

function removeCover(track: string) {
	return track.replace(/\([^)]*\b(?:cover|Cover)\b[^)]*\)/g, '');
}

function removeYear(track: string) {
	return track.replace(/\s\(\d{2}\)\s?$/g, '');
}
