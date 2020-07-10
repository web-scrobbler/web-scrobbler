'use strict';

const filter = new MetadataFilter({
    artist: cleanUpArtist
});

Connector.playerSelector = '.Main__MainElement-sc-1f3ou2j-0.dwVNSG';

Connector.artistTrackSelector = '.RadioHeader__WidgetContent-sc-17ofob1-4.irUZCR';

Connector.playButtonSelector = '.r-play-button.r-toggle-playstate-button.r-touch-button';


function cleanUpArtist(artist) {
    // Extract an artist title from a `music_note"Artist"` string.
    return artist.replace('music_note','');
}