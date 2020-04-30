'use strict';

function setup() {
	if (isPlayerPage()) {
		Util.debugLog('Setup default player');

		setupPlayerPage();
	} else if (isCardsPlayerPage()) {
		Util.debugLog('Setup cards player');

		setupCardsPlayer();
	} else {
		Util.debugLog('Unmapped page found', 'warn');
	}
}

function isPlayerPage() {
	return document.querySelector('#player-page') !== null;
}

function isCardsPlayerPage() {
	return document.querySelector('.cards-wrapper, .audio-cards') !== null;
}

function setupCardsPlayer() {
	Connector.playerSelector = '.cards-wrapper, .audio-cards';

	Connector.getTrackInfo = () => {
		const cards = document.querySelectorAll('.audio-card');
		for (const card of cards) {
			if (card.querySelector('.pause-button') !== null) {
				const artistNode = card.querySelector('.name');
				const trackNode = card.querySelector('.card-title-text');

				const artist = artistNode && artistNode.textContent;
				const track = trackNode && trackNode.textContent;

				return { artist, track };
			}
		}

		return null;
	};

	Connector.pauseButtonSelector = '.pause-button';
}


function setupPlayerPage() {
	Connector.playerSelector = '#player-page';

	Connector.artistSelector = '.user-summary-name';

	Connector.trackSelector = '.audio-file-title';

	Connector.pauseButtonSelector = '.soundwave-container > .pause-button';
}

setup();
