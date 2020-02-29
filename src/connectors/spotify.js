'use strict';

let skipIfOtherSources = false;

readConnectorOptions();

Connector.playerSelector = '.Root__now-playing-bar';

Connector.artistSelector = '.track-info__artists a';

Connector.trackSelector = '.Root__now-playing-bar .track-info__name a';

Connector.trackArtSelector = '.now-playing__cover-art .cover-art-image-loaded';

Connector.playButtonSelector = '.control-button[class*="spoticon-play-"]';

Connector.currentTimeSelector = '.Root__now-playing-bar .playback-bar__progress-time:first-child';

Connector.durationSelector = '.Root__now-playing-bar .playback-bar__progress-time:last-child';

Connector.applyFilter(MetadataFilter.getSpotifyFilter());

Connector.isScrobblingAllowed = () => {
	return isMusicPlaying() && !shouldSkipTrack();
};

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

function shouldSkipTrack() {
	const isMultipleSources = $('.ConnectBar').length > 0;
	return isMultipleSources && skipIfOtherSources;
}

async function readConnectorOptions() {
	skipIfOtherSources = await Util.getOption('Spotify', 'skipIfOtherSources');
}
