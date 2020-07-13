'use strict';

const filter = new MetadataFilter({
	artist: cleanUpArtist,
});

Connector.playerSelector = 'main';

Connector.artistTrackSelector = '.RadioHeader__WidgetContent-sc-17ofob1-4.irUZCR';

Connector.playButtonSelector = '.r-play-button';

Connector.applyFilter(filter);

function cleanUpArtist(artist) {
	// Extract an artist title from a `music_note"Artist"` string.
	return artist.replace('music_note', '');
}
