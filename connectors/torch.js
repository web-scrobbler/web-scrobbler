'use strict';

/* global Connector */

Connector.playerSelector = '#td_player';

Connector.artistSelector = '#player_links .artist';

Connector.trackSelector = '#player_title';

Connector.albumSelector = '#player_links .album';

Connector.timeInfoSelector = '#div_time';

Connector.isPlaying = () => $('.player_btn.pause').length > 0;

Connector.getTrackArt = () => {
	let url = $('#player_thumb img').attr('src');
	if (url && url.indexOf('noimage') === -1) {
		return url;
	}

	return null;
};
