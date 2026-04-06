export {};

Connector.playerSelector = 'video';

const headerPlayer = `.${CSS.escape('[&>*]:h-(--header-height)')}`;

/**
 * There is always one <video> element on the page.
 * If there is a live show streaming on page load, it autoplays, muted,
 * in the top left corner. Once the user starts playing a recorded show,
 * it takes over the existing <video> element. We want to bind to the
 * <video> element once but ignore it if it's streaming live.
 *
 * TODO test after midnight eastern
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

// TODO the last navigated show's playlist remains on the page for some reason, but with display: none
// :not([style*=display:none])
// sometimes there's no tracklist: https://www.thelotradio.com/shows/special-guests/2025-08-08-2000
// look for crying-nicholas-cage.gif
const nowPlayingSelector = 'ul li > button.text-purple';
const nowPlayingNextSelector = 'ul li:has(button.text-purple) + li > button';
Connector.trackSelector = `${nowPlayingSelector} > div > span:nth-of-type(2) > span:first-of-type`;
Connector.artistSelector = `${nowPlayingSelector} > div > span:nth-of-type(2) > span.opacity-40`;

const fullDurationSelector = `${headerPlayer} span.hidden.${CSS.escape('xl:inline')}`;

/**
 * Compare timestamps of tracks in setlist (last track is compared to full duration)
 */
Connector.getDuration = () => {
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

	const durationMs =
		timestampToDate(nextTimestamp).getTime() -
		timestampToDate(nowPlayingStart.innerText).getTime();
	return Math.ceil(durationMs / 1000);
};

function timestampToDate(stamp: string): Date {
	const d = new Date();
	const [h, m, s] = stamp.split(':').map((s) => parseInt(s));
	d.setHours(h);
	d.setMinutes(m);
	d.setSeconds(s);
	d.setMilliseconds(0);
	return d;
}
