export {};

Connector.playerSelector = '#player';

Connector.pauseButtonSelector = '#player button.stopped';

Connector.getTrackInfo = () => {
	const artistText = Util.getTextFromSelectors('#player .line3');
	const trackText = Util.getTextFromSelectors('#player .line2');

	if (
		artistText &&
		!artistText.includes(' - ') &&
		trackText &&
		!trackText.includes('Le direct')
	) {
		return {
			artist: artistText,
			track: trackText,
		};
	} else if (artistText && artistText.includes(' - ')) {
		return Util.splitArtistTrack(artistText);
	}

	return null;
};

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors('#player .cover img');

	if (trackArtUrl && !trackArtUrl.includes('.svg')) {
		return trackArtUrl.replace(/(?<=\/)\d+x\d+(?=_)/g, '400x400'); // larger image path
	}

	return null;
};

Connector.currentTimeSelector = '#player .time-left';

Connector.durationSelector = '#player .time-right';

Connector.isScrobblingAllowed = () => {
	return Boolean(
		Connector.getTrackInfo() &&
			!Util.isElementVisible('#player button.skip-ad')
	);
};
