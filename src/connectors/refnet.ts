export {};

Connector.playerSelector = '#radio';

Connector.remainingTimeSelector = '#clock';

Connector.getArtistTrack = () => {
	const marquee = Util.getTextFromSelectors('#marquee');
	const artistTrack = marquee?.split(' :: ')[0];
	const track = Util.getTextFromSelectors('#slots > .live h4');
	const artist = artistTrack?.substring(`${track} by `.length);
	return { track, artist };
};

Connector.getOriginUrl = () => {
	return location.origin;
};

Connector.isPlaying = () => {
	return Util.hasElementClass(Connector.playerSelector, 'playing');
};

Connector.scrobblingDisallowedReason = () =>
	Util.hasElementClass('#slots > .live', 'music') ? null : 'Other';
