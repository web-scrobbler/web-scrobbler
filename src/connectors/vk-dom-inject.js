'use strict';

/*
 * This script runs in non-isolated environment(vk.com itself)
 * for accessing to `window.ap` which sends player events.
 */

const INFO_ID = 0;
const INFO_OWNER_ID = 1;
const INFO_TRACK = 3;
const INFO_ARTIST = 4;
const INFO_DURATION = 5;
const INFO_TRACK_ARTS = 14;
const INFO_ADDITIONAL = 16;

setupEventListeners();

function sendUpdateEvent(type) {
	const audioObject = window.ap._currentAudio;
	if (!audioObject) {
		return;
	}

	const audioElImpl = window.ap._impl._currentAudioEl || {};
	const { currentTime } = audioElImpl;

	/*
	 * VK player sets current time equal to song duration on startup.
	 * This makes the extension to think the song is seeking to its
	 * beginning, and repeat the song. Ignore this stage to avoid
	 * this behavior.
	 */
	if (currentTime === audioObject[INFO_DURATION]) {
		return;
	}
	const trackArt = extractTrackArt(audioObject[INFO_TRACK_ARTS]);

	let track = audioObject[INFO_TRACK];
	const additionalInfo = audioObject[INFO_ADDITIONAL];
	if (additionalInfo) {
		track = `${track} (${additionalInfo})`;
	}

	window.postMessage({
		sender: 'web-scrobbler',
		type,
		trackInfo: {
			currentTime,
			trackArt,
			track,
			duration: audioObject[INFO_DURATION],
			uniqueID: `${audioObject[INFO_OWNER_ID]}_${audioObject[INFO_ID]}`,
			artist: audioObject[INFO_ARTIST],
		},
	}, '*');
}

function setupEventListeners() {
	for (const e of ['start', 'progress', 'pause', 'stop']) {
		window.ap.subscribers.push({
			et: e,
			cb: sendUpdateEvent.bind(null, e),
		});
	}
}

/**
 * Extract largest track art from list of track art URLs.
 * @param {String} trackArts String contains list of track art URLs
 * @return {String} Track art URL
 */
function extractTrackArt(trackArts) {
	const trackArtArr = trackArts.split(',');
	return trackArtArr.pop();
}
