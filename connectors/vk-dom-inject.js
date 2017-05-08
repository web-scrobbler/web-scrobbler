'use strict';

// This script runs in non-isolated environment(vk.com itself)
// for accessing to `window.ap` which sends player events

const INFO_ID = 0;
const INFO_TRACK = 3;
const INFO_ARTIST = 4;

window.webScrobblerInjected = window.webScrobblerInjected || false;

(function () {
	if (window.webScrobblerInjected) {
		return;
	}
	function sendUpdateEvent(type) {
		let audioObject = window.ap._currentAudio;
		if (!audioObject) {
			return;
		}

		let audioElImpl = window.ap._impl._currentAudioEl || {};
		let {currentTime, duration} = audioElImpl;

		/*
		 * VK player sets current time equal to song duration on startup.
 		 * This makes the extension to think the song is seeking to its
 		 * beginning, and repeat the song. Ignore this stage to avoid
 		 * this behavior.
		 */
		if (currentTime === duration) {
			return;
		}

		window.postMessage({
			sender: 'web-scrobbler',
			type,
			trackInfo: {
				currentTime,
				duration,
				uniqueID: audioObject[INFO_ID],
				artistTrack: {
					artist: audioObject[INFO_ARTIST],
					track: audioObject[INFO_TRACK],
				},

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
