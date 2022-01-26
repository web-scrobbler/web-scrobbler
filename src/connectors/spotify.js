'use strict';

const playerBar = '.Root__now-playing-bar';

const artistSelector = `${playerBar} [data-testid="context-item-info-artist"]`;
const spotifyConnectSelector = `${playerBar} [aria-live="polite"]`;

Connector.useMediaSessionApi();

Connector.playerSelector = playerBar;

Connector.artistSelector = [
	artistSelector,
	// For local files
	`${playerBar} [data-testid="track-info-artists"]`,
];

Connector.trackSelector = [
	`${playerBar} [dir="auto"]:first-child a`,
	// For local files
	`${playerBar} [data-testid="track-info-name"]`,
];

Connector.trackArtSelector = '.NavBarFooter .cover-art-image';

Connector.currentTimeSelector = `${playerBar} [data-testid=playback-position]`;

Connector.durationSelector = `${playerBar} [data-testid=playback-duration]`;

Connector.pauseButtonSelector = `${playerBar} [data-testid=control-button-playpause] > svg > path[d="M2.7 1a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7H2.7zm8 0a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-2.6z"]`;

Connector.applyFilter(MetadataFilter.getSpotifyFilter());

Connector.isScrobblingAllowed = () => isMusicPlaying() && isMainTab();

Connector.isPodcast = () => isPodcastPlaying();

Connector.getUniqueID = () => getTrackUri();

function isMusicPlaying() {
	return artistUrlIncludes('/artist/', '/show/') || isLocalFilePlaying();
}

function artistUrlIncludes(...strings) {
	const artistUrl = Util.getAttrFromSelectors(artistSelector, 'href');

	if (artistUrl) {
		for (const str of strings) {
			if (artistUrl.includes(str)) {
				return true;
			}
		}
	}

	return false;
}

function isPodcastPlaying() {
	if (isLocalFilePlaying()) {
		return false;
	}

	return artistUrlIncludes('/show/');
}

function isLocalFilePlaying() {
	// Local files has no links
	// TODO Use better detection
	return document.querySelector(artistSelector) === null;
}

function isMainTab() {
	if (hasMultipleSources()) {
		const deviceName = getActiveDeviceName();
		return deviceName && !deviceName.includes('Web Player');
	}

	return true;
}

function hasMultipleSources() {
	return document.body.classList.contains('qualaroo--connect-bar-visible');
}

function getActiveDeviceName() {
	const spotifyConnectEl = document.querySelector(spotifyConnectSelector);
	return spotifyConnectEl && spotifyConnectEl.textContent;
}

function getTrackUri() {
	const contextLinkEl = document.querySelector('[data-testid="context-link"]');
	if (!contextLinkEl || !contextLinkEl.href) {
		return null;
	}

	const url = new URL(contextLinkEl);
	const trackUri = url.searchParams.get('uri');
	if (trackUri && trackUri.startsWith('spotify:track:')) {
		return trackUri;
	}

	return null;
}
