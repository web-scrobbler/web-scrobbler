export {};

const playerBar = '[data-test=player-container]';
const controlBar = '[data-test=controls-container]';

Connector.playerSelector = playerBar;

Connector.pauseButtonSelector = `${controlBar} button[data-test-state=PLAYING]`;

Connector.artistSelector = `${playerBar} [data-test=line-text]:nth-child(3)`;

Connector.trackSelector = `${playerBar} [data-test=line-text]:nth-child(2)`;

Connector.isScrobblingAllowed = () => {
	const track = Connector.getTrack();
	return Boolean(track && !track.startsWith('Thanks for listening'));
};
