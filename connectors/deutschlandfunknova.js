'use strict';

Connector.playerSelector = '.player__main';

Connector.artistTrackSelector = 'span.title--title';

Connector.getArtistTrack = () => {
	let text = $(Connector.artistTrackSelector).text();
	let m = text.match(/"(.*)" von (.*)/);
	if (m && (m.length === 3)) {
		return { artist: m[2], track: m[1] };
	}
	return Util.splitArtistTrack(text);
};

Connector.isPlaying = () => {
	return $('.jp-audio').hasClass('jp-state-playing');
};
