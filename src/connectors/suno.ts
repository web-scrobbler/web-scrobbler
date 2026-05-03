export {};

const currentTimeSelector = 'div.min-w-8.text-right.text-xs';
const durationTimeSelector = 'div.min-w-8.text-left.text-xs';

enum TimePart {
	Current = 'current',
	Duration = 'duration',
}

Connector.playerSelector =
	'div:has(a[aria-label^="Playbar: Title"]):has(button[aria-label^="Playbar: Play button"], button[aria-label^="Playbar: Pause button"])';

Connector.artistSelector = 'a[aria-label^="Playbar: Artist"]';

Connector.trackSelector = 'a[aria-label^="Playbar: Title"]';

Connector.trackArtSelector = 'img[aria-label^="Playbar: Cover image"]';

Connector.getCurrentTime = () => getTimeSeconds(TimePart.Current);

Connector.getDuration = () => getTimeSeconds(TimePart.Duration);

Connector.playButtonSelector = 'button[aria-label^="Playbar: Play button"]';

/**
 * Get time in seconds from the playbar time elements.
 * Uses the left (current) and right (duration) time labels.
 */
function getTimeSeconds(part: TimePart): number {
	const selector =
		part === TimePart.Current ? currentTimeSelector : durationTimeSelector;
	const el = document.querySelector(selector);
	return Util.stringToSeconds(el?.textContent?.trim() ?? '');
}
