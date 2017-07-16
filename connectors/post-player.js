'use strict';

Connector.playerSelector = '.jp-audio';

Connector.currentTimeSelector = '.jp-time-holder div';

Connector.playButtonSelector = '.jp-play';

Connector.getArtistTrack = () => {
	let artist = $('#searchme').attr('data-title');
	let track = $('#searchme').attr('data-artist');
	return { artist, track };
};
