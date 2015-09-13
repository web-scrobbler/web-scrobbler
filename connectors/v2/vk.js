'use strict';

/* global Connector */

Connector.playerSelector = 'body';

Connector.artistSelector = $('.ac_wrap .performer').length ? '.ac_wrap .performer' : '#gp_performer';

Connector.trackSelector = $('.ac_wrap .title').length ? '.ac_wrap .title' : '#gp_title';

Connector.isPlaying = function () {
	return $('#head_play_btn').hasClass('playing');
};
