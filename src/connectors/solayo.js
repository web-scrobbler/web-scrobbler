'use strict';

Connector.playerSelector = '#plHelpers';

Connector.trackArtSelector = '.scImage';

Connector.artistTrackSelector = '.videoTitle.noColorLink';

Connector.getArtistTrack = () => {
	let text = $(Connector.artistTrackSelector).text();

	if (text.match(/ - /g).length === 2) {
		let arr = text.split(' - ');
		return { artist: arr[1], track: arr[2] };
	}

	return Util.splitArtistTrack(text);
};

Connector.isPlaying = () => {
	return $('.play').hasClass('pause');
};
