'use strict';

const fields = {
	artist: {
		selector: '.playing-subtitle',
		func: Util.getTextFromSelectors.bind(Util),
	},
	track: {
		selector: '.playing-title',
		func: Util.getTextFromSelectors.bind(Util),
	},
	currentTime: {
		selector: '.playing-time-current',
		func: Util.getSecondsFromSelectors.bind(Util),
	},
	duration: {
		selector: '.playing-time-duration',
		func: Util.getSecondsFromSelectors.bind(Util),
	},
	trackArt: {
		selector: '.playing-thumb',
		func: getTrackArtUrl,
	},
};

const kodiPlayerSelector = '#player-kodi';
const localPlayerSelector = '#player-local';

Connector.playerSelector = '#player-wrapper';

Connector.getTrackInfo = () => {
	const context = getCurrentContext();
	const trackInfo = {};

	for (const field in fields) {
		const { selector, func } = fields[field];
		const fullSelector = `${context} ${selector}`;

		trackInfo[field] = func(fullSelector);
	}

	return trackInfo;
};

Connector.isPlaying = () => {
	const classes = document.body.classList;

	if (classes.contains('active-player-local')) {
		return classes.contains('local-playing');
	}
	if (classes.contains('active-player-kodi')) {
		return classes.contains('kodi-playing');
	}

	throw new Error('Unknown context');
};

function getCurrentContext() {
	const classes = document.body.classList;

	if (classes.contains('active-player-local')) {
		return localPlayerSelector;
	}
	if (classes.contains('active-player-kodi')) {
		return kodiPlayerSelector;
	}

	throw new Error('Unknown context');
}

/*
 * `#player-local .playing-thumb` contains invalid path in `src` attribute.
 * Use a custom function to extract URL from CSS property only.
 */
function getTrackArtUrl(selector) {
	const element = document.querySelector(selector);
	if (element) {
		const propertyValue = getComputedStyle(element)['background-image'];
		return Util.extractUrlFromCssProperty(propertyValue);
	}

	return null;
}
