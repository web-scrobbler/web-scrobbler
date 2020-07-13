'use strict';

const filter = new MetadataFilter({
	artist: cleanUpArtist,
});

Connector.playerSelector = '.app';

Connector.artistTrackSelector = '[data-test="playingEpisodeDesc"]';

Connector.pauseButtonSelector = '[data-test="playPauseMiniplayer"][aria-label="Pause"]';

Connector.applyFilter(filter);

function cleanUpArtist(artist) {
	return artist.replace(/\s\+\s/g, ' & ');
}
