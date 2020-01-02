'use strict';

Connector.playerSelector = '#player';

Connector.artistTrackSelector = '.player-current-title';

Connector.getArtistTrack = () => {
	const text = $(Connector.artistTrackSelector).text();
	const m = text.match(/ - /g);
	if (m && m.length === 2) {
		const arr = text.split(' - ');
		return { artist: arr[1], track: arr[2] };
	}
	return Util.splitArtistTrack(text);
};

Connector.pauseButtonSelector = '.player-pause';

Connector.onReady = Connector.onStateChanged;
