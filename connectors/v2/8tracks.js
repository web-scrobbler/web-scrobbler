'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.artistSelector = '#now_playing .title_artist .a:first';

Connector.trackSelector = '#now_playing .title_artist .t:first';

Connector.albumSelector = '#now_playing .album .detail:first';

Connector.playButtonSelector = '#player_play_button';

Connector.getUniqueID = function () {
	return $('.track_details').attr('id').replace('track_details_', '');
};
