'use strict';

const filter = MetadataFilter.createFilter({
	artist: removeByText,
});

Connector.playerSelector = '#music-dataview-container';

Connector.artistSelector = '#artist-text';

Connector.trackSelector = '#title-text';

Connector.applyFilter(filter);

function removeByText(text) {
	return text.replace('by ', '');
}
