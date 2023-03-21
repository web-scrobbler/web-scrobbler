export {};

const filter = MetadataFilter.createFilter({
	track: cleanupTrack,
	artist: cleanupArtist,
});

Connector.playerSelector = 'aside.player';
Connector.trackSelector = 'aside.player .player_subhead';
Connector.artistSelector = 'aside.player .player_subhead';
Connector.isPlaying = () => Util.hasElementClass('aside.player', 'is-playing');
Connector.onReady = Connector.onStateChanged;

Connector.applyFilter(filter);

function cleanupTrack(track: string) {
	// Extract a track title from a `Track by Artist` string.
	return track.replace(/^(.*?)\s(by)\s(.*?)$/i, '$1');
}

function cleanupArtist(artist: string) {
	// Extract the artist from a `Track by Artist` string.
	return artist.replace(/^(.*?)\s(by)\s(.*?)$/i, '$3');
}
