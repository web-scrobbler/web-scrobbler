'use strict';

/* global Connector */

var pageType = $('.audio-player-wrapper').length !== 0 ? 'home' : 'collection';

switch (pageType) {
	case 'home':
		bindHome();
		break;

	case 'collection':
		bindCollection();
		break;

	default:
		console.log('Unable to match version. Please report at https://github.com/david-sabata/web-scrobbler/issues');
		break;
}

function bindHome() {
	Connector.playerSelector = '.audio-player-wrapper';

	Connector.artistSelector = '.audio-player-song p';

	Connector.trackSelector = '.audio-player-artist p';

	Connector.playButtonSelector = '.fa-play';

	Connector.trackArtImageSelector = 'img.mixtape';
}

function bindCollection() {
	Connector.playerSelector = '#player';

	Connector.artistTrackSelector = '#player h1';

	Connector.currentTimeSelector = '#player .left';

	Connector.durationSelector = '#player .right';

	Connector.isPlaying = function () {
		return $('.icon-play').parent().hasClass('ng-hide');
	};
}
