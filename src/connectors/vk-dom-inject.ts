/*
 * This script runs in non-isolated environment(vk.com itself)
 * for accessing to `window.ap` which sends player events.
 */

const VK_INFO_ID = 0;
const VK_INFO_OWNER_ID = 1;
const VK_INFO_TRACK = 3;
const VK_INFO_ARTIST = 4;
const VK_INFO_DURATION = 5;
const VK_INFO_TRACK_ARTS = 14;
const VK_INFO_ADDITIONAL = 16;

vkSetupEventListeners();

interface VKWindow {
	ap: {
		_currentAudio?: string[];
		_impl: { _currentAudioEl?: { currentTime: string } };
		subscribers: {
			push: (_: object) => void;
		};
	};
}

function vkSendUpdateEvent(type: string) {
	const audioObject = (window as unknown as VKWindow).ap._currentAudio;
	if (!audioObject) {
		return;
	}

	const currentTime = (window as unknown as VKWindow).ap._impl._currentAudioEl
		?.currentTime;

	/*
	 * VK player sets current time equal to song duration on startup.
	 * This makes the extension to think the song is seeking to its
	 * beginning, and repeat the song. Ignore this stage to avoid
	 * this behavior.
	 */
	if (currentTime === audioObject[VK_INFO_DURATION]) {
		return;
	}
	const trackArt = vkExtractTrackArt(audioObject[VK_INFO_TRACK_ARTS]);

	let track = audioObject[VK_INFO_TRACK];
	const additionalInfo = audioObject[VK_INFO_ADDITIONAL];
	if (additionalInfo) {
		track = `${track} (${additionalInfo})`;
	}

	window.postMessage(
		{
			sender: 'web-scrobbler',
			type,
			trackInfo: {
				currentTime,
				trackArt,
				track,
				duration: audioObject[VK_INFO_DURATION],
				uniqueID: `${audioObject[VK_INFO_OWNER_ID]}_${audioObject[VK_INFO_ID]}`,
				artist: audioObject[VK_INFO_ARTIST],
			},
		},
		'*',
	);
}

function vkSetupEventListeners() {
	for (const e of ['start', 'progress', 'pause', 'stop']) {
		(window as unknown as VKWindow).ap.subscribers.push({
			et: e,
			cb: vkSendUpdateEvent.bind(null, e),
		});
	}
}

/**
 * Extract largest track art from list of track art URLs.
 * @param trackArts - String contains list of track art URLs
 * @returns Track art URL
 */
function vkExtractTrackArt(trackArts: string) {
	const trackArtArr = trackArts.split(',');
	return trackArtArr.pop();
}
