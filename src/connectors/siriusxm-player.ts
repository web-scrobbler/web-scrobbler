export {};

/*
 * On some "decade" stations SiriusXM appends the last two digits
 * of the release year to the song title like this: Where Is The Love (03).
 *
 * This filter removes such suffixes.
 */

const filter = MetadataFilter.createFilter({ track: removeYear });
const removeYearRe = /\s\(\d{2}\)\s?$/g;

Connector.playerSelector = ".sxm-player-controls";
Connector.artistSelector = ".sxm-player-controls .artist-name";
Connector.trackSelector = ".sxm-player-controls .track-name";

Connector.isPlaying = () => {
	return (
		Util.getAttrFromSelectors(
			".sxm-player-controls .play-pause-btn",
			"title"
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
		(term) => artist?.includes(term) || track?.includes(term)
	);
};

Connector.applyFilter(filter);

function removeYear(track: string) {
	return track.replace(removeYearRe, "");
}
