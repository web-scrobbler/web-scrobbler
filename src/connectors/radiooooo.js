'use strict';

setupConnector();

function setupConnector() {
	if (location.hostname.startsWith('mobile')) {
		setupMobilePlayer();
	} else {
		setupPCPlayer();
	}
}

function setupMobilePlayer() {
	Connector.playerSelector = '.view--container--main';

	Connector.playButtonSelector = '.icon-play';

	Connector.trackSelector = '.song--title';

	Connector.artistSelector = '.song--artist';

	Connector.trackArtSelector = '.song--image img';
}

function setupPCPlayer() {
	Connector.playerSelector = '.bottomleft--corner, .modal--container';

	Connector.isPlaying = () => 0 < $('.play-icon').length;

	Connector.trackSelector = '.song__title';

	Connector.artistSelector = '.song__artist';

	Connector.trackArtSelector = '.song__thumbnail';

	Connector.getUniqueID = () => $('button').data('track-id');
}
