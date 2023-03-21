export {};

Connector.playerSelector = '#player';
Connector.artistSelector = '#artist';
Connector.trackSelector = '#title';
Connector.trackArtSelector = '#imgCover';
Connector.albumSelector = '#album';

Connector.isPlaying = () => Util.hasElementClass('#player', 'playing');

const filter = MetadataFilter.createFilter({
	artist: removeVonPrefix,
	album: removeAlbumPrefix,
});

Connector.applyFilter(filter);

function removeVonPrefix(text: string) {
	return text.replace('von ', '');
}

function removeAlbumPrefix(text: string) {
	return text.replace(', Album: ', '');
}
