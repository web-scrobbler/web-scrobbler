export {};

const showNameSelector = '.show-info-with-image__text__title';

Connector.playerSelector = '.track-container';

Connector.trackSelector = '.track-container .show-info__text__title';

Connector.artistSelector = '.track-container .show-info__text__subtitle';

Connector.playButtonSelector = '.circular-play-button';

Connector.isScrobblingAllowed = () => {
	return Connector.getTrack() !== getShowName();
};

function getShowName() {
	return Util.getTextFromSelectors(showNameSelector);
}
