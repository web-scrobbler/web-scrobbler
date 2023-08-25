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

Connector.playerSelector = ".sxm-player-controls";
Connector.artistSelector = ".sxm-player-controls .artist-name";
Connector.trackSelector = ".sxm-player-controls .track-name";

Connector.isPlaying = () => {
	return (
		Util.getAttrFromSelectors(
			".sxm-player-controls .play-pause-btn",
			"title",
		) === "Pause"
	);
};

Connector.trackArtSelector = ".album-image-cell img.album-image";

Connector.isScrobblingAllowed = () => {
	const artist = Connector.getArtist()?.toLowerCase();
	const track = Connector.getTrack()?.toLowerCase();
	const filteredTerms = [
		"@siriusxm",
		"@jennylsq",
		"@radiomadison",
		"@morningmashup",
		"josiah",
		"1-877-33-sirius",
		"@sxm", //will broadly catch a bunch of sxm Twitter handles
		"altnation",
		".ca",
		".com",
		"indie 1.0",
		"#",
		"facebook",
		"twitter",
	];

	return !filteredTerms.some(
		(term) => artist?.includes(term) || track?.includes(term),
	);
};

Connector.applyFilter(filter);

function removeExclusive(track: string) {
	return track.replace(/\sEXCLUSIVE/g, "");
}

function removeCover(track: string) {
	return track.replace(/\([^)]*\b(?:cover|Cover)\b[^)]*\)/g, "");
}

function removeYear(track: string) {
	return track.replace(/\s\(\d{2}\)\s?$/g, "");
}
