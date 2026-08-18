export {};

const filter = MetadataFilter.createFilter({
	artist: MetadataFilter.replaceSmartQuotes,
	track: MetadataFilter.replaceSmartQuotes,
	album: MetadataFilter.replaceSmartQuotes,
});

Connector.playerSelector = '.Player';

Connector.getArtistTrack = () => {
	const artistTrack = Util.getTextFromSelectors('.Player-title');

	return Util.splitArtistTrack(artistTrack, [' \u2022 '], true);
};

Connector.albumSelector = '.Player-album';

Connector.trackArtSelector = '.Player-coverImage';

Connector.isTrackArtDefault = (url) => url?.includes('canonical');

Connector.isPlaying = () =>
	Util.hasElementClass(Connector.playerSelector, 'Player--playing');

Connector.applyFilter(filter);
