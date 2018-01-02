'use strict';

Connector.playerSelector = '#player-bar';

Connector.getArtistTrack = () => {
	let trackElem = $('.queue-item-selected');
	let artist = trackElem.data('artist-name');
	let track = trackElem.data('track-name');

	return { artist, track };
};

Connector.playButtonSelector = '#player-play';

Connector.currentTimeSelector = '#player-time-elpased';

Connector.durationSelector = '#player-duration';
