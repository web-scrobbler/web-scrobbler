export {};

Connector.playerSelector = '.globalplayer';

const playbarSelector = '.globalplayer [data-testid="playbar"]';

const showInfoTitleSelector = `${playbarSelector} [data-testid="show-info-title"]`;
Connector.trackSelector = `${showInfoTitleSelector}>:first-child`;
Connector.artistSelector = `${showInfoTitleSelector}>:last-child`;
Connector.pauseButtonSelector = `${playbarSelector} button[data-testid="play-pause-button"][aria-pressed="true"]`;
Connector.trackArtSelector = `${playbarSelector} img`;

Connector.scrobblingDisallowedReason = () =>
	document.querySelector(showInfoTitleSelector)?.childElementCount === 1
		? 'FilteredTag'
		: null;
