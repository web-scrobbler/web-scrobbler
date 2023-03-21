export {};

Connector.playerSelector = '#player-controls';

Connector.artistSelector = '#player-nowplaying [href^="/artist/"]';

Connector.trackSelector = '#player-nowplaying [href^="/track/"]';

Connector.trackArtSelector = ['.haarp-active .thumb', '.thumb'];

Connector.isTrackArtDefault = (url) => url?.includes('solid_color') ?? false;

Connector.getUniqueID = () => {
	const trackUrl = Util.getAttrFromSelectors(
		'#player-nowplaying [href^="/track/"]',
		'href'
	);
	if (trackUrl) {
		return trackUrl.split('/').at(-1) ?? null;
	}
	return null;
};

Connector.isPlaying = () => Util.hasElementClass('#playerPlay', 'pause');

Connector.currentTimeSelector = '#player-time-position';

Connector.durationSelector = '#player-time-total';
