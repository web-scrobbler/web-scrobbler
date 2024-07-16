export {};

const filter = MetadataFilter.createFilter({
	track: cleanupTrack,
	artist: cleanupArtist,
});

Connector.playerSelector = '.playerBlock:has(svg[id$="-play-icon"].hide)';
Connector.trackSelector =
	'.playerBlock:has(svg[id$="-play-icon"].hide) .trackName';
Connector.artistSelector =
	'.playerBlock:has(svg[id$="-play-icon"].hide) .trackName';
Connector.albumSelector =
	'.playerBlock:has(svg[id$="-play-icon"].hide) span[id$="-np-album"]';
Connector.trackArtSelector =
	'.playerBlock:has(svg[id$="-play-icon"].hide) img.coverArt';

Connector.isPlaying = () =>
	Util.hasElementClass('svg[id$="-play-icon"]', 'hide');

Connector.applyFilter(filter);

function cleanupTrack(track: string) {
	// Extract a track title from a `Artist - Track` string.
	return track.replace(/^(.+?)\s*-\s*(.+)$/, '$2');
}

function cleanupArtist(artist: string) {
	// Extract the artist from a `Artist - Track` string.
	return artist.replace(/^(.+?)\s*-\s*(.+)$/, '$1');
}

Connector.scrobblingDisallowedReason = () => {
	const artist = Connector.getArtist()?.toLowerCase();
	const track = Connector.getTrack()?.toLowerCase();
	const filteredTerms = [
		'radiofreefedi',
		'station ID',
		'RFF',
		'radio free fedi',
		'theTrafficReport',
		'theNews',
		'by @',
		'fedi',
		'and @',
	];

	return filteredTerms.some(
		(term) => artist?.includes(term) || track?.includes(term),
	)
		? 'FilteredTag'
		: null;
};
