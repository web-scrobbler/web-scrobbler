export {};

const playerBar = '.c-player';
const artistSelector = `${playerBar} figcaption > p > a`;

Connector.playerSelector = playerBar;

Connector.trackSelector = `${playerBar} figcaption > h4 > a`;

Connector.getArtist = () => {
	const artistElements = document.querySelectorAll(artistSelector);
	return Util.joinArtists(Array.from(artistElements));
};

Connector.pauseButtonSelector = '.o-icon-pause';

Connector.trackArtSelector = `${playerBar} figure > div > a > img`;

Connector.timeInfoSelector = `${playerBar} .c-player__actions > li:nth-child(1)`;
