export {};

let trackInfo = {};
let isPlaying = false;

const vkFilter = MetadataFilter.createFilter(
	MetadataFilter.createFilterSetForFields(
		['artist', 'track', 'album', 'albumArtist'],
		MetadataFilter.decodeHtmlEntities,
	),
).extend(MetadataFilter.createRemasteredFilter());

Connector.isPlaying = () => isPlaying;

Connector.getTrackInfo = () => trackInfo;

Connector.onScriptEvent = (event) => {
	switch (event.data.type) {
		case 'start':
			isPlaying = true;
			break;
		case 'stop':
		case 'pause':
			isPlaying = false;
			break;
	}

	trackInfo = event.data.trackInfo as object;

	Connector.onStateChanged();
};

Connector.injectScript('connectors/vk-dom-inject.js');

Connector.applyFilter(vkFilter);
