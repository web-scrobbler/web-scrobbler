'use strict';

const filter = MetadataFilter.createFilter({
	artist: removeByText,
});

Connector.playerSelector = '#music-dataview-container';

if (window.innerWidth > 1450) {
	Connector.artistSelector = '#artist-text';
	Connector.trackSelector = '#title-text';
} else {
	Connector.artistSelector = '#marquee2 > span.artist';
	Connector.trackSelector = '#marquee1 > span';
}

Connector.applyFilter(filter);

function removeByText(text) {
	return text.replace('by ', '');
}
