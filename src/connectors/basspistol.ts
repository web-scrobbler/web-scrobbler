export {};

const filter = MetadataFilter.createFilter({
	artist: cleanupArtist,
});

Connector.playerSelector = '.radio-player-widget';
Connector.trackSelector = '.now-playing-title';
Connector.artistSelector = '.now-playing-artist';
Connector.trackArtSelector = 'img.album_art';
Connector.isPlaying = () =>
	Util.getAttrFromSelectors('.radio-control-play-button', 'aria-label') !==
	'Play';

Connector.applyFilter(filter);

function cleanupArtist(artist: string) {
	// remove brackets
	return artist.replace(/^([^(]+)(\(.*)$/, '$1');
}
