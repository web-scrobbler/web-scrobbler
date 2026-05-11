export {};

Connector.playerSelector = ['#player', '#nowplaying'];

Connector.isPlaying = () => {
	const video = document.querySelector('#player video');

	if (!(video instanceof HTMLVideoElement)) {
		Util.debugLog('video player not found', 'error');
		return;
	}

	return video.currentTime > 0 && !video.paused && !video.ended;
};

Connector.trackSelector = '#nowplaying .song-title';

Connector.artistSelector = '#nowplaying .song-artist';

Connector.scrobblingDisallowedReason = () => {
	if (document.querySelector('#nowplaying')?.textContent.trim() === '') {
		return 'IsAd';
	}
};

Connector.getTimeInfo = () => {
	const nowplaying = document.querySelector('#nowplaying');
	if (!(nowplaying instanceof HTMLElement)) {
		return null;
	}

	const { stream_delay: streamDelay, started, duration } = nowplaying.dataset;

	if (!started || !duration) {
		return null;
	}

	const startedUnixTime = Date.parse(started);
	const nowUnixTime = +new Date();

	const currentTime =
		(nowUnixTime - startedUnixTime) / 1000 - +(streamDelay ?? 0);

	return { currentTime, duration: +duration };
};
