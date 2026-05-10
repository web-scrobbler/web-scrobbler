export {};

Connector.playerSelector = '[class*=playbar--]';
Connector.trackSelector = '[class*=trackDetails--] [class*=title--]';
Connector.artistSelector = '[class*=trackDetails--] [class*=artist--]';
Connector.currentTimeSelector =
	'[class*=progressBar--] [class*=timing--]:first-child';
Connector.durationSelector =
	'[class*=progressBar--] [class*=timing--]:last-child';
Connector.scrobblingDisallowedReason = () => {
	const trackOrArtist = Util.queryElements([
		Connector.trackSelector as string,
		Connector.artistSelector as string,
	]);
	if (trackOrArtist === null) {
		// mobile UI doesn't show track and artist
		return 'ElementMissing';
	}
	return null;
};
Connector.trackArtSelector = '[class*=playbar--] [class*=thumbnail--] img';
Connector.pauseButtonSelector = '[class*=progressBar--][class*=active--]';
Connector.unloveButtonSelector =
	'[class*=playbar--] button [aria-label="HeartFilled"]';
