export {};

const oldPlayerSelector = '.player';

setupConnector();

function setupConnector() {
	const isOldPlayer = Boolean(document.querySelector(oldPlayerSelector));

	if (isOldPlayer) {
		setupOldPlayer();
	} else {
		setupNewPlayer();
	}
}

function setupOldPlayer() {
	Connector.playerSelector = oldPlayerSelector;

	Connector.playButtonSelector = '.controls .play';

	Connector.trackSelector = '.small.header.discrete.link.track';

	Connector.artistSelector = '.meta > .artist';

	Connector.albumSelector = '.meta > .album';

	Connector.currentTimeSelector = '.timer.start';

	Connector.durationSelector = '.timer.total';

	Connector.trackArtSelector = '.player .image img';
}

function setupNewPlayer() {
	Connector.playerSelector = '.controls-row';

	Connector.pauseButtonSelector = 'button[aria-label=Pause]';

	Connector.trackSelector = '.track-controls a.track';

	Connector.artistSelector = '.meta :nth-child(1 of a)';

	Connector.albumSelector = '.meta :nth-child(2 of a)';

	Connector.currentTimeSelector = '.timer .start';

	Connector.durationSelector = '.timer .total';

	Connector.trackArtSelector = '.controls .image img';
}
