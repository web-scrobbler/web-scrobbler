'use strict';

Connector.playerSelector = '#player';

Connector.artistTrackSelector = '.player-current-title';

Connector.getArtistTrack = () => {
	let text = $(Connector.artistTrackSelector).text();
	let m = text.match(/ - /g);
	if (m && (m.length === 2)) {
		let arr = text.split(' - ');
		return { artist: arr[1], track: arr[2] };
	}
	return Util.splitArtistTrack(text);
};

Connector.isPlaying = () => {
	return $('.player-pause').is(':visible');
};

Connector.onReady = Connector.onStateChanged;
