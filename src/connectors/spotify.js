'use strict';

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

/*
 * When ad is playing, artist URL is like "https://shrt.spotify.com/XXX",
 * otherwise URL leads to:
 * a) an artist page https://open.spotify.com/artist/YYY;
 * b) a podcast page https://open.spotify.com/show/ZZZ.
 */

function isAdPlaying() {
	return artistUrlIncludes('shrt.spotify.com');
}

function artistUrlIncludes(str) {
	const artistUrl = $(Connector.artistSelector).attr('href');
	return artistUrl && artistUrl.includes(str);
}
