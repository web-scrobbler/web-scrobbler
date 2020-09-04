'use strict';

Connector.currentTimeSelector = '.jw-text-elapsed';

Connector.durationSelector = '.jw-text-duration';

Connector.isPlaying = () => !document.querySelector('video').paused;

Connector.playerSelector = '#theatre-ia';

Connector.trackArtSelector = '#theatre-ia center > img';

Connector.getArtistTrack = () => {
	let track = document.querySelector('.jwrowV2.playing .ttl, .audio-track-list .selected .track-title').textContent;
	const artist = document.querySelector('.key-val-big a span, .metadata-definition > dd').textContent;

	const trackParts = track.split('-').map((item) => {
		return item.trim();
	});

	if (trackParts.length === 3 && trackParts[0] === artist) {
		track = trackParts[2];
	}

	return { artist, track };
};

Connector.albumSelector = '.thats-left > h1 [itemprop=name]';
