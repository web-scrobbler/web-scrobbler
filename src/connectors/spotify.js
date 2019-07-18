'use strict';

/**
 * The connector for new version of Spotify (open.spotify.com).
 */

Connector.playerSelector = '.Root__now-playing-bar';

Connector.artistSelector = '.track-info__artists a';

Connector.trackSelector = '.Root__now-playing-bar .track-info__name a';

Connector.trackArtSelector = '.now-playing__cover-art .cover-art-image-loaded';

Connector.playButtonSelector = '.control-button[class*="spoticon-play-"]';

Connector.currentTimeSelector = '.Root__now-playing-bar .playback-bar__progress-time:first-child';

Connector.durationSelector = '.Root__now-playing-bar .playback-bar__progress-time:last-child';

Connector.applyFilter(MetadataFilter.getSpotifyFilter());

Connector.isScrobblingAllowed = () => {
	return isMusicPlaying();
};

function isMusicPlaying() {
	/*
	 * When ad is playing, artist URL is like "https://shrt.spotify.com/XXX",
	 * otherwise URL leads to an artist page "https://open.spotify.com/artist/YYY".
	 */
	let artistUrl = $('.track-info__artists a').attr('href');
	return artistUrl && artistUrl.includes('artist');
}
