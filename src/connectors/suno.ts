export {};

const durationSelector = 'span[aria-label^="Playbar: Duration for"]';

enum TimePart {
	Current = 'current',
	Duration = 'duration',
}

Connector.playerSelector =
	'div:has(a[aria-label^="Playbar: Title"]):has(button[aria-label^="Playbar: Play button"])';

Connector.artistSelector = 'a[aria-label^="Playbar: Artist"]';

Connector.trackSelector = 'a[aria-label^="Playbar: Title"]';

Connector.trackArtSelector = 'img[aria-label^="Playbar: Cover image"]';

Connector.getCurrentTime = () => getTimeSeconds(TimePart.Current);

Connector.getDuration = () => getTimeSeconds(TimePart.Duration);

Connector.playButtonSelector = 'button[aria-label^="Playbar: Play button"]';

/**
 * Retrieves the time value in seconds from the DOM element for the specified time part.
 *
 * This function finds the element using the provided `durationSelector`, splits its text content
 * by the "/" character, and then converts the appropriate segment into seconds using `Util.stringToSeconds`.
 *
 * @param part - Specifies which part of the time to retrieve:
 *               TimePart.Current returns the current playback time,
 *               TimePart.Duration returns the total duration.
 * @returns A number representing the time in seconds.
 */
function getTimeSeconds(part: TimePart): number {
	const timeElement = document.querySelector(durationSelector);
	if (!timeElement || !timeElement.textContent) {
		return Util.stringToSeconds('');
	}
	const [currentTimeStr, durationStr] = timeElement.textContent
		.split('/')
		.map((str) => str.trim());
	if (part === TimePart.Current) {
		return Util.stringToSeconds(currentTimeStr ?? '');
	}

	return Util.stringToSeconds(durationStr ?? '');
}
