export {};

Connector.playerSelector = '.audio-controller';

Connector.artistSelector = '.info .artist';

Connector.trackSelector = '.info .song';

Connector.isPlaying = () => {
	return (
		Util.getTextFromSelectors('.audio-controller .any-surfer') ===
		'Stop de radiospeler'
	);
};
