'use strict';

const artistSelectors = [
	'.key-val-big a span',
	'.metadata-definition > dd',
];
const trackSelectors = [
	'.jwrowV2.playing .ttl',
	'.audio-track-list .selected .track-title',
];

const numericTrackRegex = /^\d+\w+/;

const tracksSelector = '.jwrowV2 .ttl';

const filter = new MetadataFilter({ track: removeNumericPrefixes });

Connector.applyFilter(filter);

function removeNumericPrefixes(track) {
	if (hasAllTracksNumericPrefix(tracksSelector)) {
		return track.trim().replace(/^(\d+\w+)/, '');
	}

	return track;
}

Connector.currentTimeSelector = '.jw-text-elapsed';

Connector.durationSelector = '.jw-text-duration';

Connector.isPlaying = () => {
	const videoElement = document.querySelector('video');

	if (videoElement === null) {
		return false;
	}

	return !videoElement.paused;
};

Connector.playerSelector = '#theatre-ia';

Connector.trackArtSelector = '#theatre-ia center > img';

Connector.getArtistTrack = () => {
	let track = Util.getTextFromSelectors(trackSelectors);
	const artist = Util.getTextFromSelectors(artistSelectors);

	const trackParts = track.split('-').map((item) => {
		return item.trim();
	});

	if (trackParts.length === 3 && trackParts[0] === artist) {
		track = trackParts[2];
	}

	return { artist, track };
};

Connector.albumSelector = '.thats-left > h1 [itemprop=name]';

// Example: https://archive.org/details/AH003_corwin_trails_-_corwin_trails
function hasAllTracksNumericPrefix(trackSelector) {
	const tracks = document.querySelectorAll(trackSelector);
	if (tracks.length === 0) {
		return false;
	}

	let hasAllTracksNumericPrefix = true;
	for (const track of tracks) {
		if (!numericTrackRegex.test(track.textContent)) {
			hasAllTracksNumericPrefix = false;
			break;
		}
	}

	return hasAllTracksNumericPrefix;
}
