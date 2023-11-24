export {};

Connector.playerSelector = '#player';

Connector.isPlaying = () => {
	const text = Util.getTextFromSelectors('[data-testid="mainButton"]') ?? '';
	return ['STOP', 'PAUSE'].includes(text);
};

Connector.getArtistTrack = () => {
	const track = Util.getTextFromSelectors('section > div.Line > p > span');
	if (track) return Util.splitArtistTrack(track, [' \u2022 ']);
	return {
		artist: Util.getTextFromSelectors('.Metadata .firstline'),
		track: Util.getTextFromSelectors('.Metadata .secondline'),
	};
};

Connector.getTrackArt = () =>
	Util.getAttrFromSelectors('.Cover picture source', 'srcset');

Connector.currentTimeSelector = '.time span:nth-child(1)';

Connector.durationSelector = '.time span:nth-child(3)';
