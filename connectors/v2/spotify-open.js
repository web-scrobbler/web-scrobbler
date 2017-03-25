'use strict';

/* global Connector, MetadataFilter, Util */

/**
 * The connector for new version of Spotify (open.spotify.com).
 */

Connector.playerSelector = '.now-playing-bar';

Connector.getArtist = function() {
	let artists = $('.now-playing-bar span > span > a').toArray();
	return Util.joinArtists(artists);
};

Connector.trackSelector = '.now-playing-bar div > div > div > a';

Connector.trackArtImageSelector = '.now-playing-bar .cover-art-image-loaded';

Connector.isPlaying = function() {
	return $('.spoticon-pause-32').length > 0;
};

Connector.filter = MetadataFilter.getRemasteredFilter();
