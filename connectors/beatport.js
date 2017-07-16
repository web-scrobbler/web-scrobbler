'use strict';

Connector.playerSelector = '.player-container';

Connector.artistSelector = '.player-track-name-artist-standard .track-artist';

Connector.trackSelector = '.player-track-name-artist-standard .primary-title';

Connector.getUniqueID = () => {
	let trackUrl = $('.player-current-track-container a').attr('href');
	let index = trackUrl.lastIndexOf('/');
	return trackUrl.substring(index + 1);
};

Connector.isPlaying = () => {
	return $('.player-controls .play-button').hasClass('pause');
};

Connector.filter = new MetadataFilter({
	all: MetadataFilter.trim, track: removeOriginalMix
});

function removeOriginalMix(track) {
	let remixedBy = $('.player-track-name-artist-standard .remixed').text();
	if (remixedBy === 'Original Mix') {
		return track;
	}

	return `${track} (${remixedBy})`;
}
