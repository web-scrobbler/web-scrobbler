export {};

const filter = MetadataFilter.createFilter({
	artist: formatArtists,
});

Connector.playerSelector = '.header';

Connector.trackArtSelector = '.player-image > img';

Connector.artistSelector = '.player-artist-text';

Connector.trackSelector = '.player-title-text';

Connector.playButtonSelector = '.pause-btn > .fa-play';

Connector.onReady = Connector.onStateChanged;

Connector.applyFilter(filter);

function formatArtists(text: string) {
	const artist = text.split(',');
	return artist[0];
}
