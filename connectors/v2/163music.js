'use strict';

/* global Connector */

Connector.playerSelector = '.m-playbar';

Connector.trackArtImageSelector = '.head.j-flag img';

Connector.getTrack = function() {
	var track = $('.fc1').text();
	var re = new RegExp(String.fromCharCode(160), 'g');
	return track.replace(re, ' ');
};

Connector.getArtist = function () {
	return $('.by').children('span').attr('title') || null;
};

Connector.playButtonSelector = '.btns .ply';

Connector.currentTimeSelector = '.j-flag.time em';

Connector.getDuration = function () {
	let timeStr = $('#g_player .time').text();
	return Connector.stringToSeconds(timeStr.substr(timeStr.length - 4));
};

Connector.isPlaying = function () {
	return $('.btns .ply').hasClass('pas');
};
