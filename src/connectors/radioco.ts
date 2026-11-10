export {};

const filter = MetadataFilter.createFilter({
	artist: MetadataFilter.replaceSmartQuotes,
	track: MetadataFilter.replaceSmartQuotes,
	album: MetadataFilter.replaceSmartQuotes,
});

Connector.playerSelector = '.radioco-player';

Connector.artistSelector = '.track-artist';

Connector.trackSelector = '.track-name';

Connector.trackArtSelector = '.current-artwork';

Connector.isPlaying = () =>
	Util.hasElementClass(Connector.playerSelector, 'playing');

Connector.applyFilter(filter);
