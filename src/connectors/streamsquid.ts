'use strict';

Connector.playerSelector = '#player-bar';

Connector.getArtistTrack = () => {
	const trackElem = $('.queue-item-selected');
	const artist = trackElem.data('artist-name');
	const track = trackElem.data('track-name');

	return { artist, track };
};

Connector.playButtonSelector = '#player-play';

Connector.currentTimeSelector = '#player-time-elpased';

Connector.durationSelector = '#player-duration';
