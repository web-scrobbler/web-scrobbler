'use strict';

const filter = MetadataFilter.createFilter({
	artist: removeByText,
});

Connector.playerSelector = '#music-dataview-container';
// should be '.artist'
Connector.artistSelector = '#marquee2 > span.artist';

Connector.trackSelector = '#marquee1 > span';

Connector.applyFilter(filter);

function removeByText(text) {
	return text.replace('by ', '');
}
