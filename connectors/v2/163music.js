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
		var totalSecondValue = $('#g_player').find('.time').text();
		var duration = '';
		if (totalSecondValue) {
				totalSecondValue = totalSecondValue.substr(totalSecondValue.length-4);
				duration = +totalSecondValue.split(':')[0]*60 + (+totalSecondValue.split(':')[1]);
		}
	return duration;
};

Connector.isPlaying = function () {
	return $('.btns .ply').hasClass('pas');
};
