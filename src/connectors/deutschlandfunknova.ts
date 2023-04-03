export {};

Connector.playerSelector = 'div.player.desktop';

Connector.artistTrackSelector = '.playing-title';

Connector.getArtistTrack = () => {
	const text = Util.getTextFromSelectors(Connector.artistTrackSelector);
	const m = text?.match(/"(.*?)" von (.*?)\u2003\u00B7\u2003/);
	if (m && m.length === 3) {
		// Sometimes the title box displays something like '"undefined" von undefined'
		if (m[2].toLowerCase() === 'undefined') {
			return null;
		}
		return { artist: m[2], track: m[1] };
	}
	return Util.splitArtistTrack(text);
};

Connector.isPlaying = () => {
	return Boolean(document.querySelector('.plyr--playing'));
};
