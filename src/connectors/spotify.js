'use strict';

/**
 * The connector for new version of Spotify (open.spotify.com).
 */

Connector.playerSelector = '.now-playing-bar';

Connector.getArtist = () => $('.track-info__artists a').first().text();

Connector.trackSelector = '.track-info__name a';

Connector.trackArtSelector = '.now-playing__cover-art .cover-art-image-loaded';

Connector.playButtonSelector = '.control-button[class*="spoticon-play-"]';

Connector.currentTimeSelector = '.playback-bar__progress-time:first-child';

Connector.durationSelector = '.playback-bar__progress-time:last-child';

Connector.filter = MetadataFilter.getRemasteredFilter();

Connector.isScrobblingAllowed = () => {
	return isMusicPlaying();
};

function isMusicPlaying() {
	if (Connector.getArtist() !== 'Spotify') {
		return true;
	}

	// When ad is playing, artist URL is like "https://shrt.spotify.com/XXX",
	// otherwise URL leads to an artist page "https://open.spotify.com/artist/YYY".
	let artistUrl = $('.track-info__artists a').attr('href');
	return artistUrl && artistUrl.includes('artist');
}
