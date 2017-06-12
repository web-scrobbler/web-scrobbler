'use strict';

/* global Connector */

Connector.playerSelector = '#opbanner';

Connector.getArtist = function () {
	return $('#sim_song_info .js_singer').attr('title');
};

Connector.getTrack = function() {
	return $('#sim_song_info .js_song').attr('title');
};

Connector.isPlaying = function () {
	return $('#btnplay').hasClass('btn_big_play--pause');
};

Connector.timeInfoSelector = '#time_show';

Connector.trackArtSelector = '#song_pic';
