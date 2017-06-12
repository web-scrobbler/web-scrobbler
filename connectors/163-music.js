'use strict';

/* global Connector */

const trackRegEx = new RegExp(String.fromCharCode(160), 'g');

Connector.playerSelector = '.m-playbar';

Connector.trackArtSelector = '.head.j-flag img';

Connector.getTrack = function() {
	let track = $('.fc1').text();
	return track.replace(trackRegEx, ' ');
};

Connector.getArtist = function () {
	return $('.by span').attr('title');
};

Connector.playButtonSelector = '.btns .ply';

Connector.timeInfoSelector = '.j-flag.time';

Connector.isPlaying = function () {
	return $('.btns .ply').hasClass('pas');
};
