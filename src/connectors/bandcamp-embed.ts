export {};

const filter = MetadataFilter.createFilter({
	artist: MetadataFilter.replaceSmartQuotes,
	track: MetadataFilter.replaceSmartQuotes,
	album: MetadataFilter.replaceSmartQuotes,
});

Connector.playerSelector = '#player';

Connector.artistSelector = '#artist';

Connector.trackSelector = '#currenttitle_title';

Connector.albumSelector = '#album';

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors('#infolayer .art');

	if (trackArtUrl) {
		return trackArtUrl.replace(/(?<=_)\d{1,2}(?=\.jpg)/, '5'); // larger image
	}

	return null;
};

Connector.currentTimeSelector = '#currenttime';

Connector.durationSelector = '#totaltime';

Connector.isPlaying = () =>
	Util.hasElementClass(Connector.playerSelector, 'playing');

Connector.applyFilter(filter);
