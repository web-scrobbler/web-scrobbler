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

	Connector.playButtonSelector = '.player-controls .play';

	Connector.trackSelector = '.content .track';

	Connector.artistSelector = '.meta > a:first';

	Connector.albumSelector = '.meta > a:last';

	Connector.currentTimeSelector = '.timer .start';

	Connector.durationSelector = '.timer .total';

	Connector.trackArtSelector = '.controls .image img';
}
