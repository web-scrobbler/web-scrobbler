export {};

addWindowListeners();

const filter = MetadataFilter.createFilter({
	artist: removeByText,
});

Connector.playerSelector = '#music-dataview-container';

Connector.applyFilter(filter);

function removeByText(text: string) {
	return text.replace('by ', '');
}

function setMetadataSelectors() {
	if (window.innerWidth >= 1450) {
		Connector.artistSelector = '#artist-text';
		Connector.trackSelector = '#title-text';
	} else {
		Connector.artistSelector = '#marquee2 > span.artist';
		Connector.trackSelector = '#marquee1 > span';
	}
}

function addWindowListeners() {
	addEventListener('resize', setMetadataSelectors);
	setMetadataSelectors();
}
