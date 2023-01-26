'use strict';

Connector.playerSelector = '[class^=Player_PlayerBar_bar]';

Connector.artistSelector = '[class^=MusicArtistRole_role]';

Connector.playButtonSelector = 'button[title="Afspil"]';

Connector.getTrack = () => {
    var trackName = null;
    const trackElement = document.querySelector('[class^=MusicTrackLine_title]');
    if (!trackElement) {
        return null;
    }
    for (const child of trackElement.childNodes) {
        if ( child.nodeType === Node.TEXT_NODE && child.textContent.trim() != '' ) {
            trackName = child.textContent;
        }
    }
    return trackName;
}