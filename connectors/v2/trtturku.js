'use strict';
// Author: Oğuzhan TÜRK

// Scrobbling for: http://www.trtturku.net/

/* global Connector */

function toTitleCase(str) {
	str = str.toLowerCase().split(' ');

	for(var i = 0; i < str.length; ++i){
		str[i] = str[i].split('');
		str[i][0] = str[i][0] === 'i' ? 'İ' : str[i][0].toUpperCase();
		str[i] = str[i].join('');
	}

	return str.join(' ');
}

Connector.playerSelector = '.jwplayer';

Connector.getArtist = function() {
	return toTitleCase($('#besa_mp3_play_area tr:nth-child(2) > td:nth-child(2)').text());
};

Connector.getTrack = function() {
	return toTitleCase($('#besa_mp3_play_area tr:nth-child(3) > td:nth-child(2)').text());
};

Connector.isPlaying = function () {
	return $('.jwplay.jwtoggle').length === 1;
};

Connector.durationSelector = '.jwduration';
Connector.currentTimeSelector = '.jwelapsed';
