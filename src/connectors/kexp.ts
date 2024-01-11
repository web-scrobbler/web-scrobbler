export {};

const filter = MetadataFilter.createFilter({
	artist: replaceSmartQuotes,
	track: replaceSmartQuotes,
	album: replaceSmartQuotes,
});

Connector.playerSelector = '.Player';

Connector.artistTrackSelector = '.Player-title';

Connector.albumSelector = '.Player-album';

Connector.trackArtSelector = '.Player-coverImage';

Connector.isTrackArtDefault = (url) => url?.includes('default');

Connector.isPlaying = () =>
	Util.hasElementClass(Connector.playerSelector, 'Player--playing');

Connector.applyFilter(filter);

function replaceSmartQuotes(text: string) {
	return text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"');
}
