'use strict';

let scrobblePodcasts = true;

readConnectorOptions();

Connector.playerSelector = '#player';

Connector.getTrackArt = () => {
	let trackArtUrl = $('#playerBarArt').attr('src');
	if (trackArtUrl) {
		return trackArtUrl.replace('=s90-c-e100', '');
	}

	return null;
};

Connector.artistSelector = '#player-artist';

Connector.getTrack = () => {
	return $('#currently-playing-title').text() ||
		$('#player-song-title').text();
};

Connector.albumSelector = '.player-album';

Connector.currentTimeSelector = '#time_container_current';

Connector.durationSelector = '#time_container_duration';

Connector.isPlaying = () => {
	return $('#player *[data-id="play-pause"]').hasClass('playing');
};

Connector.isScrobblingAllowed = () => {
	if (!scrobblePodcasts && $('#player .now-playing-actions').hasClass('podcast')) {
		return false;
	}
	return Connector.getArtist() !== 'Subscribe to go ad-free';
};

/**
 * Asynchronously read connector options.
 */
function readConnectorOptions() {
	chrome.storage.sync.get('Connectors', (data) => {
		if (data && data.Connectors && data.Connectors.GoogleMusic) {
			let options = data.Connectors.GoogleMusic;
			scrobblePodcasts = options.scrobblePodcasts;
			let optionsStr = JSON.stringify(options, null, 2);
			console.log(`Web Scrobbler: Connector options: ${optionsStr}`);
		}
	});
}
