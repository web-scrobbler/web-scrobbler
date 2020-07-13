'use strict';

const filter = new MetadataFilter({
	artist: cleanUpArtist,
});

Connector.playerSelector = 'main';

//Connector.artistTrackSelector = '[class^=RadioHeader__WidgetContent]'; // works with radio channels without the program title ('Groove FM' & 'Anna sen soida')
Connector.artistTrackSelector = 'main > div > div > section > div > div:nth-child(2) > div:nth-child(2) > div'; // works with radio channels with the program title (all the rest except the earlier ones)


Connector.playButtonSelector = '.r-play-button';

Connector.applyFilter(filter);

function cleanUpArtist(artist) {
	// Extract an artist title from a `music_note"Artist"` string.
	return artist.replace('music_note', '');
}
