export {};

const filter = MetadataFilter.createFilter({
	artist: cleanUpArtist,
});

Connector.playerSelector = ['#mini-player', '#fullscreen-dialog'];

Connector.artistTrackSelector = `${Connector.playerSelector[0]} [class*="currentlyPlaying"] .nrk-font-footnote`;

Connector.pauseButtonSelector = `${Connector.playerSelector[0]} .nrk-button .nrk-media-pause`;

Connector.trackArtSelector = `${Connector.playerSelector[1]} [class*="_image"] img`;

Connector.applyFilter(filter);

function cleanUpArtist(artist: string) {
	return artist.replace(/\s\+\s/g, ' & ');
}
