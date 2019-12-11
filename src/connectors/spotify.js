'use strict';

const adUrls = [
	'utm_source=display',
	'ad.doubleclick.net',
	'spotify:playlist',
	'shrt.spotify.com'
];

Connector.playerSelector = '.Root__now-playing-bar';

Connector.artistSelector = '.track-info__artists a';

Connector.trackSelector = '.Root__now-playing-bar .track-info__name a';

Connector.trackArtSelector = '.now-playing__cover-art .cover-art-image-loaded';

Connector.playButtonSelector = '.control-button[class*="spoticon-play-"]';

Connector.currentTimeSelector = '.Root__now-playing-bar .playback-bar__progress-time:first-child';

Connector.durationSelector = '.Root__now-playing-bar .playback-bar__progress-time:last-child';

Connector.applyFilter(MetadataFilter.getSpotifyFilter());

Connector.isScrobblingAllowed = () => !isAdPlaying();

Connector.isPodcast = () => artistUrlIncludes('/show/');

function isAdPlaying() {
	for (const adUrl of adUrls) {
		if (artistUrlIncludes(adUrl)) {
			return true;
		}
	}

	return false;
}

function artistUrlIncludes(str) {
	const artistUrl = $(Connector.artistSelector).attr('href');
	return artistUrl && artistUrl.includes(str);
}
