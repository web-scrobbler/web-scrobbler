'use strict';

const filter = MetadataFilter.createFilter(
	MetadataFilter.createFilterSetForFields(
		['artist', 'track', 'album', 'albumArtist'],
		trimSpaces
	)
);

const filterRules = [
	{ source: /\t/g, target: ' ' },
	{ source: /\n/g, target: ' ' },
	{ source: /\s+/g, target: ' ' },
];

Connector.playerSelector = '#app';

Connector.artistSelector = '.player-song-artist';

Connector.trackSelector = '.player-song-title';

Connector.isPlaying = () => {
	return !!Util.getAttrFromSelectors('#audio-player', 'src');
};

Connector.applyFilter(filter);

function trimSpaces(text) {
	return MetadataFilter.filterWithFilterRules(text, filterRules);
}
