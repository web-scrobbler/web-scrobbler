export {};

const wwozFilter = MetadataFilter.createFilter({
	track: (text) =>
		MetadataFilter.filterWithFilterRules(text, wwozFilterRules),
});

const wwozFilterRules = [
	{ source: /"(.+?)"/g, target: '$1' },
	{ source: /\s*\[[^\]]+]$/, target: '' },
	{ source: /\s*\([^)]*version\)$/i, target: '' },
];

Connector.playerSelector = '#player';

Connector.artistSelector = '#player .artist';

Connector.trackSelector = '#player .title';

Connector.isPlaying = () =>
	Util.hasElementClass('#oz-audio-container', 'jp-state-playing');

Connector.applyFilter(wwozFilter);
