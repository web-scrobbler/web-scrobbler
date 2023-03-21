export {};

const openfmFilter = MetadataFilter.createFilter({
	album: removeYearFromAlbum,
});

Connector.playerSelector = '#openfm-player';

Connector.artistSelector = '#station-view .station-details > h3';

Connector.trackSelector = '#station-view .station-details > h2';

Connector.albumSelector = '#station-view .station-details > h4';

Connector.pauseButtonSelector = '.controls-con > .stop-btn';

Connector.applyFilter(openfmFilter);

function removeYearFromAlbum(text: string) {
	return text.replace(/ \[\d*\]$/, '');
}
