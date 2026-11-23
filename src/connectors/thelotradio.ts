export {};

/**
 * Examples for testing:
 * With tracklist: https://www.thelotradio.com/shows/special-guests/2026-11-23-1400
 * Missing tracklist: https://www.thelotradio.com/shows/special-guests/2025-08-08-2000
 */

Connector.playerSelector = 'video';

const headerPlayer = `.${CSS.escape('[&>*]:h-(--header-height)')}`;

/**
 * There is always one <video> element on the page.
 * If there is a live show streaming on page load, it autoplays, muted,
 * in the top left corner. Once the user starts playing a recorded show,
 * it takes over the existing <video> element. We want to bind to the
 * <video> element once but ignore it if it's streaming live.
 */
Connector.isStateChangeAllowed = () => {
	const liveLabel = Util.getTextFromSelectors(`${headerPlayer} li.bg-purple`);
	const isLive = liveLabel === 'THE LOT LIVE';
	return !isLive;
};

Util.bindListeners(
	['video'],
	['playing', 'pause', 'timeupdate', 'ended', 'durationchange'],
	Connector.onStateChanged,
);
Util.bindListeners(['ul li > button'], ['click'], Connector.onStateChanged);

Connector.isPlaying = () => {
	const video = document.querySelector('video');
	return Boolean(video && !video.paused && !video.ended);
};

/**
 * Some shows have no tracklist, so we scrobble the whole thing
 */
const missingTracklistSelector = 'img[src^="/images/crying-nicolas-cage.gif"]';
const showTitleSelector = 'main header h1';
function isMissingTracklist() {
	return Util.isElementVisible(missingTracklistSelector);
}

const nowPlayingSelector = 'main ul > li > button[aria-current="true"]';
const nowPlayingNextSelector =
	'main ul > li:has(> button[aria-current="true"]) + li > button';
const trackSelector = `${nowPlayingSelector} > div > span:nth-of-type(2) > span:first-of-type`;
const artistSelector = `${nowPlayingSelector} > div > span:nth-of-type(2) > span:nth-of-type(2)`;

Connector.getTrack = () => {
	if (isMissingTracklist()) {
		return getTextContentFromSelectors(showTitleSelector);
	}

	return getTextContentFromSelectors(trackSelector);
};

Connector.getArtist = () => {
	if (isMissingTracklist()) {
		return 'The Lot Radio';
	}

	return getTextContentFromSelectors(artistSelector);
};

function getTrackStart() {
	const timestamp = getTextContentFromSelectors(
		`${nowPlayingSelector} > div > span:first-of-type`,
	);
	return timestamp === null ? undefined : Util.stringToSeconds(timestamp);
}

Connector.getCurrentTime = () => {
	const currentTime = document.querySelector('video')?.currentTime;
	const start = isMissingTracklist() ? 0 : getTrackStart();
	if (currentTime === undefined || start === undefined) {
		return undefined;
	}
	return Math.max(0, currentTime - start);
};

/**
 * Compare timestamps of tracks in setlist (last track is compared to full duration)
 */
Connector.getDuration = () => {
	const duration = document.querySelector('video')?.duration;
	if (isMissingTracklist()) {
		return duration;
	}

	const start = getTrackStart();
	if (start === undefined) {
		return undefined;
	}

	const nextPlayingStart = getTextContentFromSelectors(
		`${nowPlayingNextSelector} > div > span:first-of-type`,
	);
	const end =
		nextPlayingStart === null
			? duration
			: Util.stringToSeconds(nextPlayingStart);
	return end !== undefined && end > start ? end - start : undefined;
};

/**
 * Util.getTextFromSelectors but using textContent (to avoid text-transform: uppercase)
 */
function getTextContentFromSelectors(
	selectors: string | string[] | null,
	defaultValue: string | null = null,
): string | null {
	if (selectors === null) {
		return defaultValue;
	}
	const elements = Util.queryElements(selectors);

	if (!elements) {
		return defaultValue;
	}

	for (const element of elements) {
		// Ignore hidden show pages retained after client-side navigation.
		if (element.closest('[style*="display: none"]')) {
			continue;
		}
		const text = element.textContent;
		if (text) {
			return text;
		}
	}

	return defaultValue;
}
