'use strict';

const playerSelector = '.kIpMXu';
const artistSelector = `${playerSelector} .fSOgMq a`;
const trackSelector = '.jlfeQT';
const trackArtSelector = `${playerSelector} .XVHIE img`;
const playBtnSelector = '.jEJMuB';
const concatArtistNames = function() {
	return $(artistSelector)
		.map((_, el) => $(el).text())
		.get()
		.join(', ');
};
const isPlaying = function() {
	return $(playBtnSelector).find('i:first').hasClass('playerIcon--pause');
};

// Connector methods

Connector.playerSelector = playerSelector;
Connector.trackSelector = trackSelector;
Connector.trackArtSelector = trackArtSelector;

Connector.getArtist = concatArtistNames;
Connector.isPlaying = isPlaying;
