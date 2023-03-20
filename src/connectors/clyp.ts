'use strict';


function setup() {
	if (isPlayerPage()) {
		setupPlayerPage();
	} else if (isCardsPlayerPage()) {
		setupCardsPlayer();
	} else {
		console.warn('Unmapped page found');
	}
}

function isPlayerPage() {
	return $('#player-page').length !== 0;
}

function isCardsPlayerPage() {
	return $('.cards-wrapper, .audio-cards').length !== 0;
}

function setupCardsPlayer() {
	Connector.playerSelector = '.cards-wrapper, .audio-cards';

	Connector.getArtist = () => {
		const container = $('.audio-card').has('.pause-button');
		return container.find('span.name').text();
	};

	Connector.getTrack = () => {
		const container = $('.audio-card').has('.pause-button');
		return container.find('.card-title-text').text();
	};

	Connector.isPlaying = () => $('.pause-button.small').length !== 0;
}


function setupPlayerPage() {
	Connector.playerSelector = '#player-page';

	Connector.artistSelector = '.user-summary-name';

	Connector.trackSelector = '.audio-file-title';

	Connector.isPlaying = () => $('.soundwave-container > .pause-button').length !== 0;
}

setup();
