export {};

/**
 * Examples for testing:
 * With tracklist: https://www.thelotradio.com/shows/house-of-diggs-with-dee-diggs/2026-02-25-1300
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
	['playing', 'pause', 'timeupdate'],
	Connector.onStateChanged,
);
Util.bindListeners(['ul li > button'], ['click'], Connector.onStateChanged);

/**
 * Some shows have no tracklist, so we scrobble the whole thing
 */
const missingTracklistSelector = 'img[src^="/images/crying-nicolas-cage.gif"]';
const showTitleSelector =
	'header h1:has(+ div div button[aria-label="Save Episode"])';
function isMissingTracklist() {
	const elements = Util.queryElements(missingTracklistSelector);
	return (
		elements !== undefined &&
		elements?.length !== undefined &&
		elements.length > 0
	);
}

const notDisplayNone = ':not([style*="display: none"])'; // ignores hidden tracklists from previously navigated shows
const nowPlayingSelector = `.grid${notDisplayNone} ul li > button.text-purple`;
const nowPlayingNextSelector = `.grid${notDisplayNone} ul li:has(button.text-purple) + li > button`;
const trackSelector = `${nowPlayingSelector} > div > span:nth-of-type(2) > span:first-of-type`;
const artistSelector = `${nowPlayingSelector} > div > span:nth-of-type(2) > span.opacity-40`;

Connector.getTrack = () => {
	if (isMissingTracklist()) {
		return getTextContentFromSelectors(showTitleSelector);
	} else {
		return getTextContentFromSelectors(trackSelector);
	}
};

Connector.getArtist = () => {
	if (isMissingTracklist()) {
		return 'The Lot Radio';
	} else {
		return getTextContentFromSelectors(artistSelector);
	}
};

const fullDurationSelector = `${headerPlayer} span.hidden.${CSS.escape('xl:inline')}`;

/**
 * Compare timestamps of tracks in setlist (last track is compared to full duration)
 */
Connector.getDuration = () => {
	if (isMissingTracklist()) {
		const fullDuration = Util.queryElements(fullDurationSelector)?.[0];
		if (!fullDuration) return undefined;
		return Util.stringToSeconds(
			fullDuration?.innerText.replace(' / ', '0'),
		);
	} else {
		const nowPlayingStart = Util.queryElements(
			`${nowPlayingSelector} > div > span:first-of-type`,
		)?.[0] as HTMLSpanElement | undefined;
		if (!nowPlayingStart) return undefined;

		const nextPlayingStart = Util.queryElements(
			`${nowPlayingNextSelector} > div > span:first-of-type`,
		)?.[0] as HTMLSpanElement | undefined;
		let nextTimestamp;
		if (nextPlayingStart) {
			nextTimestamp = nextPlayingStart.innerText;
		} else {
			const fullDuration = Util.queryElements(fullDurationSelector)?.[0];
			nextTimestamp = fullDuration?.innerText.replace(' / ', '0');
		}
		if (!nextTimestamp) return undefined;

		return (
			Util.stringToSeconds(nextTimestamp) -
			Util.stringToSeconds(nowPlayingStart.innerText)
		);
	}
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
		const text = element.textContent;
		if (text) {
			return text;
		}
	}

	return defaultValue;
}
