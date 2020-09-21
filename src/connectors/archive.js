'use strict';

const artistSelectors = [
	'.key-val-big a span',
	'.metadata-definition > dd',
];
const trackSelectors = [
	'.jwrowV2.playing .ttl',
	'.audio-track-list .selected .track-title',
];

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

	if (hasAllTracksNumericPrefix('.jwrowV2 .ttl')) {
		track = track.trim().replace(/^(\d+\w+)/, '');
	}

	return { artist, track };
};

Connector.albumSelector = '.thats-left > h1 [itemprop=name]';

function hasAllTracksNumericPrefix(trackSelector) {
	const tracks = document.querySelectorAll(trackSelector);
	if (tracks.length === 0) {
		return false;
	}

	let hasAllTracksNumericPrefix = true;
	const re = /^\d+\w+/;
	for (let i = 0; i < tracks.length; ++i) {
		if (!re.test(tracks[i].innerText)) {
			hasAllTracksNumericPrefix = false;
			break;
		}
	}

	return hasAllTracksNumericPrefix;
}
