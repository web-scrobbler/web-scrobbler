'use strict';

const playerBar = '.Root__now-playing-bar';

Connector.playerSelector = playerBar;

Connector.artistSelector = `${playerBar} [dir="auto"]:last-child a`;

Connector.trackSelector = `${playerBar} [dir="auto"]:first-child a`;

Connector.trackArtSelector = '.NavBarFooter .cover-art-image';

Connector.playButtonSelector = `${playerBar} .control-button[class*="spoticon-play-"]`;

Connector.currentTimeSelector = `${playerBar} .playback-bar__progress-time:first-child`;

Connector.durationSelector = `${playerBar} .playback-bar__progress-time:last-child`;

Connector.applyFilter(MetadataFilter.getSpotifyFilter());

Connector.isScrobblingAllowed = () => isMusicPlaying() && isSingleSourceIsPlaying();

Connector.isPodcast = () => artistUrlIncludes('/show/');

function isMusicPlaying() {
	return artistUrlIncludes('/artist/', '/show/');
}

function artistUrlIncludes(...strings) {
	const artistUrl = $(Connector.artistSelector).attr('href');

	if (artistUrl) {
		for (const str of strings) {
			if (artistUrl.includes(str)) {
				return true;
			}
		}
	}

	return false;
}

function isSingleSourceIsPlaying() {
	return $('.ConnectBar').length === 0;
}
