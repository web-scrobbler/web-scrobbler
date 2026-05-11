export {};

Connector.playerSelector = '.globalplayer';

const playbarSelector = '.globalplayer [data-testid="playbar"]';

Connector.trackSelector = `${playbarSelector} [data-testid="show-info-title"]>:first-child`;
Connector.artistSelector = `${playbarSelector} [data-testid="show-info-title"]>:last-child`;
Connector.pauseButtonSelector = `${playbarSelector} button[data-testid="play-pause-button"][aria-pressed="true"]`;
Connector.trackArtSelector = `${playbarSelector} img`;

Connector.scrobblingDisallowedReason = () =>
	Connector.getTrack() === Connector.getArtist() ? 'FilteredTag' : null;
