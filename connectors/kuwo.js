'use strict';

Connector.playerSelector = '#player';

Connector.getArtistTrack = () => {
	let artistTrack = $('#wp_text').attr('title');
	return Util.splitArtistTrack(artistTrack, null, true);
};

Connector.isPlaying = () => $('#wp_playBtn').hasClass('zan');

Connector.trackArtSelector = '#artist_Image';
