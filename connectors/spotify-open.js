'use strict';

/* global Connector, MetadataFilter, Util */

/**
 * The connector for new version of Spotify (open.spotify.com).
 */

Connector.playerSelector = '.now-playing-bar';

Connector.getArtist = function () {
	let artists = $('.track-info__artists a').toArray();
	return Util.joinArtists(artists);
};

Connector.trackSelector = '.track-info__name a';

Connector.trackArtSelector = '.now-playing__cover-art .cover-art-image-loaded';

Connector.playButtonSelector = '.control-button[class*="spoticon-play-"]';

Connector.currentTimeSelector = '.playback-bar__progress-time:first-child';

Connector.durationSelector = '.playback-bar__progress-time:last-child';

Connector.filter = MetadataFilter.getRemasteredFilter();
