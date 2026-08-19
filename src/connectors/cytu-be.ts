export {};

function removeCurrentlyPlaying(text: string) {
	return text.replace(/^Currently\s*Playing:\s*/i, '');
}

const filter = MetadataFilter.createFilter({
	artist: removeCurrentlyPlaying,
	track: removeCurrentlyPlaying,
});

Connector.playerSelector = '#videowrap';

Connector.artistTrackSelector = '#currenttitle';

Connector.applyFilter(filter);
