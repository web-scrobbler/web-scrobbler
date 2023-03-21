export {};

const filter = MetadataFilter.createFilter({
	artist: cleanUpArtist,
});

Connector.playerSelector = '.app';

Connector.artistTrackSelector = '[data-test="playingEpisodeDesc"]';

Connector.pauseButtonSelector =
	'[data-test="playPauseMiniplayer"][aria-label="Pause"]';

Connector.applyFilter(filter);

function cleanUpArtist(artist: string) {
	return artist.replace(/\s\+\s/g, ' & ');
}
