'use strict';

/* global Connector, Util */

/**
 * The connector for new version of Spotify (open.spotify.com).
 */

Connector.playerSelector = '.nowPlayingBar-container';

Connector.getArtist = function() {
	let artists = $('.track-info__artists a').toArray();
	return Util.joinArtists(artists);
};

Connector.trackSelector = '.track-info__name a';

Connector.trackArtImageSelector = '.now-playing__cover-art .cover-art-image-loaded';

Connector.playButtonSelector = '.control-button[class*="spoticon-play-"]';

Connector.currentTimeSelector = '.player-controls__progress-time:first-child';

Connector.durationSelector = '.player-controls__progress-time:last-child';
