export {};

const wefunkradioArtistFilterRules = [
	{ source: /\s*talk \(over\s+(.+)$/i, target: '$1' },
];

const wefunkradioTrackFilterRules = [
	{ source: /\s*\((?:start|end|beginning) of [^)]+ set\)$/i, target: '' },
	{ source: /^([^()]*)\)$/, target: '$1' },
];

const wefunkradioFilter = MetadataFilter.createFilter({
	artist: (text) =>
		MetadataFilter.filterWithFilterRules(
			text,
			wefunkradioArtistFilterRules,
		),
	track: (text) =>
		MetadataFilter.filterWithFilterRules(text, wefunkradioTrackFilterRules),
});

Connector.playerSelector = '.player-control';

Connector.artistTrackSelector = '.player-control-title';

Connector.applyFilter(wefunkradioFilter);

Connector.scrobblingDisallowedReason = () => {
	const filteredTerms = [/\([^)]*\bunknown\b[^)]*\)/i];

	const track = Connector.getArtistTrack();

	return filteredTerms.some((term) => track?.track?.match(term))
		? 'FilteredTag'
		: null;
};
