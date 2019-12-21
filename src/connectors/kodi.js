'use strict';

const trackArtSelector = '.playing-thumb';

const fieldSelectors = {
	artist: '.playing-subtitle',
	track: '.playing-title',
	currentTime: 'currentTimeSelector',
	duration: '.playing-time-duration'
};

const kodiPlayerSelector = '#player-kodi';
const localPlayerSelector = '#player-local';

Connector.playerSelector = '#player-wrapper';

Connector.getTrackInfo = () => {
	const context = getCurrentContext();
	const trackInfo = {};

	for (const field in fieldSelectors) {
		const selector = fieldSelectors[field];
		const fullSelector = `${context} ${selector}`;

		trackInfo[field] = Util.getTextFromSelectors(fullSelector);
	}

	const trackArtFullSelector = `${context} ${trackArtSelector}`;
	trackInfo.trackArt = getTrackArtUrl(trackArtFullSelector);

	return trackInfo;
};

Connector.isPlaying = () => {
	const body = $('body');

	if (body.hasClass('active-player-local')) {
		return body.hasClass('local-playing');
	}
	if (body.hasClass('active-player-kodi')) {
		return body.hasClass('kodi-playing');
	}

	throw new Error('Unknown context');
};

function getCurrentContext() {
	const body = $('body');

	if (body.hasClass('active-player-local')) {
		return localPlayerSelector;
	}
	if (body.hasClass('active-player-kodi')) {
		return kodiPlayerSelector;
	}

	throw new Error('Unknown context');
}

/*
 * `#player-local .playing-thumb` contains invalid path in `src` attribute.
 * Use a custom function to extract URL from CSS property only.
 */
function getTrackArtUrl(selector) {
	const element = Util.queryElements(selector);
	if (element) {
		const propertyValue = element.css('background-image');
		return Util.extractUrlFromCssProperty(propertyValue);
	}

	return null;
}
