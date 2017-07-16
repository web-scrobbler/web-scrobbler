'use strict';

Connector.playerSelector = 'body';

Connector.getArtist = () => {
	let artists = $('.now_playing .artist a').toArray();
	return Util.joinArtists(artists);
};

Connector.trackSelector = '.now_playing .title';

Connector.albumSelector = '.now_playing .album';

Connector.trackArtSelector = '.now_playing .art_container';

Connector.isPlaying = () => $('#r4_audio_player').hasClass('playing');
