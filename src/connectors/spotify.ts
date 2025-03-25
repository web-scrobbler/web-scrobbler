export {};

const playerBar = '.Root [data-testid="now-playing-bar"]';

const artistSelector = `${playerBar} [data-testid="context-item-info-artist"]`;
const oldPlayingPath =
	'M2.7 1a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7H2.7zm8 0a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-2.6z';
const newPlayingPath =
	'M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z';
const spotifyConnectSelector = `${playerBar} [aria-live="polite"]`;
const oldPauseButtonSelector = `${playerBar} [data-testid=control-button-playpause] svg path[d="${oldPlayingPath}"]`;
const newPauseButtonSelector = `${playerBar} [data-testid=control-button-playpause] svg path[d="${newPlayingPath}"]`;

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

Connector.trackArtSelector = `${playerBar} [data-testid=cover-art-image]`;

Connector.currentTimeSelector = `${playerBar} [data-testid=playback-position]`;

Connector.durationSelector = `${playerBar} [data-testid=playback-duration]`;

Connector.pauseButtonSelector = `${oldPauseButtonSelector}, ${newPauseButtonSelector}`;

Connector.applyFilter(MetadataFilter.createSpotifyFilter());

Connector.scrobblingDisallowedReason = () =>
	isMusicPlaying() && isMainTab() ? null : 'IsPlayingElsewhere';

Connector.isPodcast = () => isPodcastPlaying();

Connector.getUniqueID = () => getTrackUri();

Connector.getOriginUrl = () => getTrackUrl();

Connector.loveButtonSelector = `${playerBar} button[data-testid="add-button"][aria-checked="false"]`;

Connector.unloveButtonSelector = `${playerBar} button[data-testid="add-button"][aria-checked="true"]`;

function isMusicPlaying() {
	return artistUrlIncludes('/artist/', '/show/') || isLocalFilePlaying();
}

function artistUrlIncludes(...strings: string[]) {
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
	return document.querySelector(spotifyConnectSelector) !== null;
}

function getActiveDeviceName() {
	const spotifyConnectEl = document.querySelector(spotifyConnectSelector);
	return spotifyConnectEl && spotifyConnectEl.textContent;
}

function getTrackUrl() {
	const trackUri = getTrackUri();
	if (trackUri === null) {
		return null;
	}

	const trackId = trackUri?.split(':')?.[2];
	if (!trackId) {
		return null;
	}

	return `https://open.spotify.com/track/${trackId}`;
}

function getTrackUri() {
	const contextLinkEl = document.querySelector(
		'[data-testid="context-link"]',
	) as HTMLAnchorElement;
	if (!contextLinkEl || !contextLinkEl.href) {
		return null;
	}

	const url = new URL(contextLinkEl.href);
	const trackUri = url.searchParams.get('uri');
	if (!trackUri || !trackUri.startsWith('spotify:track:')) {
		return null;
	}

	return trackUri;
}
