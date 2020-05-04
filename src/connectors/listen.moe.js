'use strict';

const filter = new MetadataFilter({ all: trimSpaces });

const filterRules = [
	{ source: /\t/g, target: ' ' },
	{ source: /\n/g, target: ' ' },
	{ source: /\s+/g, target: ' ' },
];

Connector.playerSelector = '#app';

Connector.artistSelector = '.player-song-artist';

Connector.trackSelector = '.player-song-title';

Connector.isPlaying = () => {
	return $('#audio-player').attr('src') !== undefined;
};

Connector.applyFilter(filter);

function trimSpaces(text) {
	return MetadataFilter.filterWithFilterRules(text, filterRules);
}
