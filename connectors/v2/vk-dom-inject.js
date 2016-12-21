'use strict';

// This script runs in non-isolated environment(vk.com itself)
// for accessing to `window.ap` which sends player events

window.webScrobblerInjected = window.webScrobblerInjected || false;

(function () {
	if (window.webScrobblerInjected) {
		return;
	}
	function sendUpdateEvent(type) {
		const {currentTime} = window.ap._impl._currentAudioEl || {};
		const {id, performer, title, duration} = window.audio || {};
		window.postMessage({
			sender: 'web-scrobbler',
			type,
			trackInfo: {
				uniqueID: id,
				artistTrack: {
					artist: performer,
					track: title,
				},
				currentTime,
				duration,
			},
		}, '*');
	}
	for (let e of ['start', 'progress', 'pause', 'stop']) {
		window.ap.subscribers.push({
			et: e,
			cb: sendUpdateEvent.bind(null, e),
		});
	}
	window.webScrobblerInjected = true;
})();
