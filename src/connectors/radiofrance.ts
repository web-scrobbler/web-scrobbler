export {};

const PLAY_BUTTON = '[data-testid="mainButton"]';

const BUTTON_STATE_TEXT = 'STOP';

Connector.playerSelector = '#player';

Connector.playButtonSelector = PLAY_BUTTON;

Connector.isPlaying = () =>
	Util.getTextFromSelectors(PLAY_BUTTON) === BUTTON_STATE_TEXT;

Connector.getArtistTrack = () => {
	const track = Util.getTextFromSelectors('section > div.Line > p > span');
	return Util.splitArtistTrack(track, [' \u2022 ']);
};

Connector.getTrackArt = () =>
	Util.getAttrFromSelectors('.Cover picture source', 'srcset');

Connector.currentTimeSelector = '.time span:nth-child(1)';

Connector.durationSelector = '.time span:nth-child(3)';
