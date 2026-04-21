export {};

const filter = MetadataFilter.createFilter({
	artist: cleanUpArtist,
});

Connector.playerSelector = '#mini-player';

Connector.artistTrackSelector = `${Connector.playerSelector} [class*="currentlyPlaying"] .nrk-font-footnote`;

Connector.pauseButtonSelector = `${Connector.playerSelector} .nrk-button .nrk-media-pause`;

Connector.applyFilter(filter);

function cleanUpArtist(artist: string) {
	return artist.replace(/\s\+\s/g, ' & ');
}
