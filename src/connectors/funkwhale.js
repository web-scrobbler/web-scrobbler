'use strict';

const oldPlayerSelector = '.player';

setupConnector();

function setupConnector() {
	const oldPlayerContainer = document.querySelector(oldPlayerSelector);

	if (oldPlayerContainer) {
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

	Connector.artistSelector = '.meta > a:first-child';

	Connector.albumSelector = '.meta > a:last-child';

	Connector.currentTimeSelector = '.timer .start';

	Connector.durationSelector = '.timer .total';

	Connector.trackArtSelector = '.controls .image img';
}
