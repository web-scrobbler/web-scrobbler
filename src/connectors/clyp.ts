export {};

function setup() {
	if (isPlayerPage()) {
		setupPlayerPage();
	} else if (isCardsPlayerPage()) {
		setupCardsPlayer();
	} else {
		Util.debugLog('Unmapped page found', 'warn');
	}
}

function isPlayerPage() {
	return Boolean(document.querySelector('#player-page'));
}

function isCardsPlayerPage() {
	return Boolean(document.querySelector('.cards-wrapper, .audio-cards'));
}

function setupCardsPlayer() {
	Connector.playerSelector = '.cards-wrapper, .audio-cards';

	Connector.getArtist = () => {
		const cards = Util.queryElements('.audio-card');
		if (!cards) {
			return null;
		}
		const container = [...cards].filter((element) =>
			element.classList.contains('pause-button')
		)[0];
		return container.querySelector('span.name')?.textContent;
	};

	Connector.getTrack = () => {
		const cards = Util.queryElements('.audio-card');
		if (!cards) {
			return null;
		}
		const container = [...cards].filter((element) =>
			element.classList.contains('pause-button')
		)[0];
		return container.querySelector('.card-title-text')?.textContent;
	};

	Connector.isPlaying = () =>
		Boolean(document.querySelector('.pause-button.small'));
}

function setupPlayerPage() {
	Connector.playerSelector = '#player-page';

	Connector.artistSelector = '.user-summary-name';

	Connector.trackSelector = '.audio-file-title';

	Connector.isPlaying = () =>
		Boolean(document.querySelector('.soundwave-container > .pause-button'));
}

setup();
