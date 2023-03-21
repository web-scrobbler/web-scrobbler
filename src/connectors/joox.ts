export {};

const playerSelector = '.kIpMXu';
const artistSelector = `${playerSelector} .kOwKMw a`;

Connector.useMediaSessionApi();

Connector.playerSelector = playerSelector;

Connector.trackSelector = '.xXMwE';

Connector.trackArtSelector = `${playerSelector} .XVHIE img`;

Connector.getArtist = () => {
	const artistNodes = document.querySelectorAll(artistSelector);
	return Util.joinArtists(Array.from(artistNodes));
};

Connector.currentTimeSelector = '#currentTime';

Connector.durationSelector = '.GeFxq';

Connector.playButtonSelector = '.playerIcon--play';
