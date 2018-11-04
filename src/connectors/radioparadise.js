'use strict';

Connector.playerSelector = '.content-wrapper';

Connector.artistSelector = '.song_info_display div:first-child b';

Connector.trackSelector = '.song_info_display div:nth-child(2) b';

Connector.isPlaying = () => $('#play-button').hasClass('active');

Connector.getTrackArt = () => {
	return `${$('#info .cover a').find('img').attr('src')}`;
};
