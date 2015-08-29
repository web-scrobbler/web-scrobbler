'use strict';

/* global Connector */

Connector.playerSelector = '#box_controls';

Connector.artistSelector = '#app_artist_name\\[0\\]';

Connector.trackSelector = '#app_song_title\\[0\\]';

Connector.isPlaying = function () {
	return $('#music').attr('data-status') === 'active';
};
