'use strict';

Connector.playerSelector = '#page_sidebar';

Connector.getArtist = () => {
	let artists = $('.player-track-artist').children().toArray();
	return Util.joinArtists(artists);
};

Connector.trackSelector = '.player-track-title';

Connector.currentTimeSelector = '.player-progress .progress-time';

Connector.durationSelector = '.player-progress .progress-length';

Connector.trackArtSelector = '.player-cover img';

Connector.filter = MetadataFilter.getRemasteredFilter();

Connector.isPlaying = () => $('#player .svg-icon-pause').length > 0;
