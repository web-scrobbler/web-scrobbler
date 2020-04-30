'use strict';

Connector.playerSelector = '#player-bar';

// `#player-track-name` and `#player-track-artist` can contain truncated strings
Connector.getArtistTrack = () => {
	const trackElem = document.querySelector('.queue-item-selected');
	if (!trackElem) {
		return null;
	}

	const artist = trackElem.getAttribute('data-artist-name');
	const track = trackElem.getAttribute('data-track-name');

	return { artist, track };
};

Connector.playButtonSelector = '#player-play';

Connector.currentTimeSelector = '#player-time-elpased';

Connector.durationSelector = '#player-duration';
