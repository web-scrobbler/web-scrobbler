export {};

Connector.playerSelector = '[class*="PlayerBar_playerContainer"]';

Connector.currentTimeSelector = '[class*="ProgressBar_timerStart"]';

/**
 * We compute the duration based on current time.
 *
 * DOM does not seem to have the duration number anywhere, however it has the current time and progress bar.
 *
 * Calculate how far into the song we are and what currenttime is to estimate duration:
 * currentTime / duration = progressDecimal
 * currentTime = progressDecimal * duration
 * currentTime / progressDecimal = duration
 */
Connector.getDuration = () => {
	const currentTime = Connector.getCurrentTime();
	if (!currentTime) {
		return null;
	}

	const progressElement = document.querySelector(
		'[class*="ProgressBar_progress__"]',
	) as HTMLElement;
	if (!progressElement) {
		return null;
	}
	// strip everything except transformX value, this is 0 at finished track, -100 at start of track.
	// convert into a number thats easier to work with. (progress percentage expressed as 0-1 decimal).
	const progressDecimal =
		(100 + Number(progressElement.style.transform.slice(11, -2))) / 100;
	return currentTime / progressDecimal;
};

Connector.playButtonSelector =
	'[class*="ControlButton_containerPrimary"]:nth-child(2)[title="Играть [P]"]';

Connector.useMediaSessionApi();
