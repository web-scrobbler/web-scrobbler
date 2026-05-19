export {};

const originalConnectorLabel = Connector.meta.label;

Connector.playerSelector = '.kr-webplayer';

Connector.artistSelector = '.meta-info .meta-interpret';

Connector.trackSelector = '.meta-info :nth-last-child(1 of .meta-title)';

// the url redirects to something else for each song, not worth it
// Connector.trackArtSelector =
// 	'.kr-webplayer-maxi .metadata-img-info-wrapper img';

Connector.isPlaying = () =>
	Util.getTextFromSelectors('.play-stop-button')?.trim() === 'stop';

Connector.scrobblingDisallowedReason = () => {
	const stationText = Util.getTextFromSelectors(
		'.meta-info :nth-child(1 of .meta-title)',
	);
	if (
		!!document.querySelector('.track-slider-disabled-live') &&
		stationText
	) {
		Connector.meta.label = stationText;
	} else {
		Connector.meta.label = originalConnectorLabel;
	}

	return null;
};
