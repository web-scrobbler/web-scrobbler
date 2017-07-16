'use strict';

Connector.playerSelector = '.album-tracks';

Connector.getArtistTrack = () => {
	let text = $('.play:contains("ll")').attr('download');
	return Util.splitArtistTrack(text);
};

Connector.isPlaying = () => $('.play:contains("ll")').length > 0;
