export {};

// A more specific selector simply wouldn't work
Connector.playerSelector = 'body';

Connector.artistTrackSelector = '#nowplaying';

Connector.playButtonSelector = '#playerPlay';

const filter = MetadataFilter.createFilter({
	artist: onlyArtist,
});

Connector.applyFilter(filter);

function onlyArtist(artist: string) {
	const chunks = artist.split('\n');
	return chunks[chunks.length - 1];
}
