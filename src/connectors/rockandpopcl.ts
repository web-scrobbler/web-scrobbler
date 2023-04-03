export {};

const filter = MetadataFilter.createFilter({ artist: joinArtists });

Connector.playerSelector = '#player-layer';

Connector.pauseButtonSelector = '.js-player-play i.fa-pause';

Connector.artistSelector = '.player-info-title > .js-player-presenter';

Connector.trackSelector = '.player-info-title .js-player-title';

Connector.trackArtSelector = '.player-data .image-player';

Connector.isScrobblingAllowed = () => {
	return (
		!Connector.getArtist()?.includes('24/7') &&
		!Connector.getTrack()?.includes('24/7') &&
		!Util.extractImageUrlFromSelectors(
			Connector.trackArtSelector
		)?.includes('/fotos/original/')
	);
};

Connector.applyFilter(filter);

function joinArtists(text: string) {
	return text.replace(/(?<!\d),(?!\s)/, ' and ');
}
