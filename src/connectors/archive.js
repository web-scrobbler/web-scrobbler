'use strict';

const artistSelectors = [
	'.key-val-big a span',
	'.metadata-definition > dd',
];
const trackSelectors = [
	'.jwrowV2.playing .ttl',
	'.audio-track-list .selected .track-title',
];

Connector.playerSelector = '#theatre-ia';

Connector.currentTimeSelector = '.jw-text-elapsed';

Connector.durationSelector = '.jw-text-duration';

Connector.trackArtSelector = '#theatre-ia center > img';

Connector.getArtistTrack = () => {
	let track = Util.getTextFromSelectors(trackSelectors);
	const artist = Util.getTextFromSelectors(artistSelectors);

	if (track) {
		const trackParts = track.split('-').map((item) => {
			return item.trim();
		});
		if (trackParts.length === 3 && trackParts[0] === artist) {
			track = trackParts[2];
		}
	}

	return { artist, track };
};

Connector.isPlaying = () => {
	const videoElements = document.getElementsByTagName('video');
	return videoElements.length > 0 && !videoElements[0].paused;
};

Connector.albumSelector = '.thats-left > h1 [itemprop=name]';
