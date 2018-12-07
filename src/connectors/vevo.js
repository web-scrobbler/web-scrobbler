'use strict';

Connector.playerSelector = '#markup';

Connector.trackSelector = '.watch-info .video-name';

Connector.currentTimeSelector = '.progress-texts span:nth-child(1)';

Connector.durationSelector = '.progress-texts span:nth-child(3)';

Connector.filter = MetadataFilter.getYoutubeFilter();

Connector.getArtist = () => {
	let artists = $('.watch-info .artist a').toArray();
	return Util.joinArtists(artists);
};

Connector.isPlaying = () => $('#control-bar').hasClass('state-playing');

Connector.getUniqueID = () => $('meta[property="og:ytid"]').attr('content');
