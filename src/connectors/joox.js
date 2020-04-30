'use strict';

const playerSelector = '.kIpMXu';
const artistSelector = `${playerSelector} .fSOgMq a`;

Connector.playerSelector = playerSelector;

Connector.trackSelector = '.jlfeQT';

Connector.trackArtSelector = `${playerSelector} .XVHIE img`;

Connector.getArtist = () => {
	const artistNodes = document.querySelectorAll(artistSelector);
	return Util.joinArtists(Array.from(artistNodes));
};

Connector.playButtonSelector = '.jEJMuB';
