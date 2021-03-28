'use strict';

Connector.playerSelector = '.player';
Connector.trackArtSelector = '.player-image';
Connector.trackSelector = '.track-name';
Connector.artistSelector = '.track-artist';

const LIVE_365_ARTIST = 'Live365';
const ADWTAG = 'ADWTAG';
const ADBREAK = 'Ad Break';

Connector.isPlaying = () => Util.hasElementClass('.playing-indicator', 'is-playing');

Connector.isScrobblingAllowed = () => {
	const artist = Connector.getArtist();
	return artist !== LIVE_365_ARTIST && !artist.includes(ADWTAG) && !artist.includes(ADBREAK);
};
