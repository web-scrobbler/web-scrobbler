'use strict';

Connector.playerSelector = '#n11_player';

Connector.artistSelector = '.full_info .in .artist';

Connector.trackSelector = '.full_info .in .song';

Connector.getAlbum = () => {
	return $('.full_info .in .album').attr('title');
};

Connector.currentTimeSelector = '.time_1';

Connector.durationSelector = '.time_2';

Connector.isPlaying = () => {
	return $('.client_player .pbtn_pause').length !== 0;
};

Connector.trackArtSelector = '.album_view img';
