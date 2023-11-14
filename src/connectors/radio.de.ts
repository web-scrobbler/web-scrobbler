export {};

Connector.playerSelector = 'div.player-nav-holder';

Connector.artistTrackSelector = 'span';

Connector.getArtistTrack = () => {
	const text = Util.getTextFromSelectors(Connector.artistTrackSelector);
	const m = text?.match(/(.*?) - (.*?) auf (.*?)/);
	if (m && m.length === 4) {
		return { artist: m[1], track: m[2] };
	}
	return null;
};

Connector.isPlaying = () =>
	Util.getAttrFromSelectors('.player_playbutton', 'title') !== 'Wiedergabe';
