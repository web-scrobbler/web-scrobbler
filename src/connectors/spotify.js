'use strict';

const playerBar = '.Root__now-playing-bar';

const artistSelector = `${playerBar} [dir="auto"]:last-child a`;
const spotifyConnectSelector = '[class*=spoticon-spotify-connect]';

const playPauseButtonSvgPathSelector = `${playerBar} .player-controls__buttons button:nth-child(3) path`;
const playButtonSvgPath = 'M4.018 14L14.41 8 4.018 2z';

Connector.useMediaSessionApi();

Connector.playerSelector = playerBar;

Connector.artistSelector = artistSelector;

Connector.trackSelector = `${playerBar} [dir="auto"]:first-child a`;

Connector.trackArtSelector = '.NavBarFooter .cover-art-image';

Connector.currentTimeSelector = `${playerBar} .playback-bar__progress-time:first-child`;

Connector.durationSelector = `${playerBar} .playback-bar__progress-time:last-child`;

Connector.applyFilter(MetadataFilter.getSpotifyFilter());

Connector.isScrobblingAllowed = () => isMusicPlaying() && isMainTab();

Connector.isPodcast = () => artistUrlIncludes('/show/');

Connector.isPlaying = () => {
	const svgPath = Util.getAttrFromSelectors(
		playPauseButtonSvgPathSelector,
		'd'
	);
	if (svgPath) {
		return svgPath !== playButtonSvgPath;
	}

	return true;
};

function isMusicPlaying() {
	return artistUrlIncludes('/artist/', '/show/');
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

function isMainTab() {
	if (hasMultipleSources()) {
		const spotifyConnectIconEl = document.querySelector(
			spotifyConnectSelector
		);
		if (spotifyConnectIconEl !== null) {
			const spotifyConnectEl = spotifyConnectIconEl.parentNode;
			const deviceName = spotifyConnectEl.textContent;

			return !deviceName.includes('Web Player');
		}
	}

	return true;
}

function hasMultipleSources() {
	return document.body.classList.contains('qualaroo--connect-bar-visible');
}
