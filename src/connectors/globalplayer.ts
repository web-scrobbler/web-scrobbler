export {};

const showNameSelector =
	'div[class^="style_playbarInfo"] div[data-testid="show-info-title"]';

Connector.playerSelector = '.globalplayer';
Connector.trackSelector =
	'div[data-testid="show-info-card"] h1[data-testid="show-info-title"]';
Connector.artistSelector =
	'div[data-testid="show-info-card"] h2[data-testid="show-info-subtitle"]';
Connector.playButtonSelector =
	'button[data-testid="play-pause-button"][aria-pressed="false"]';
Connector.trackArtSelector = 'div[class^="style_showInfoCard"] img.current-img';

Connector.scrobblingDisallowedReason = () =>
	Connector.getTrack() === getShowName() ? 'FilteredTag' : null;

function getShowName() {
	return Util.getTextFromSelectors(showNameSelector);
}
