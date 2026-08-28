export {};

const nowPlaying = '#p-now-playing';
const filter = MetadataFilter.createFilter({
	artist: MetadataFilter.replaceSmartQuotes,
	track: MetadataFilter.replaceSmartQuotes,
	album: MetadataFilter.replaceSmartQuotes,
});

Connector.playerSelector = '#p-daily-article';

Connector.artistSelector = `${nowPlaying} .albumtitle > span`;

Connector.trackSelector = `${nowPlaying} .trackname > span:last-of-type`;

Connector.albumSelector = `${nowPlaying} .albumtitle > b`;

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(
		`${nowPlaying} .art-text > img`,
	);

	if (trackArtUrl) {
		return trackArtUrl.replace(/(?<=_)\d{1,2}(?=\.jpg)/, '16'); // larger image
	}

	return null;
};

Connector.currentTimeSelector =
	'.mplayer.playing .mptime [data-bind$=positionStr]';

Connector.durationSelector =
	'.mplayer.playing .mptime [data-bind$=durationStr]';

Connector.isPlaying = () => Util.hasElementClass('.mplayer', 'playing');

Connector.applyFilter(filter);
