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

Connector.playerSelector = '._playbackControls_1cag9_17';

Connector.artistTrackSelector = '._playbackControls_1cag9_17 ._title_1cag9_286';

Connector.trackArtSelector =
	'._playbackControls_1cag9_17 ._trackImage_1cag9_178 ._image-image_2xo9u_188';

Connector.playButtonSelector =
	'._playbackControls_1cag9_17 button[aria-label="Play"]';

Connector.pauseButtonSelector =
	'._playbackControls_1cag9_17 button[aria-label="Pause"]';

Connector.isScrobblingAllowed = () => {
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

	return !filteredTerms.some(
		(term) => artist?.includes(term) || track?.includes(term),
	);
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
