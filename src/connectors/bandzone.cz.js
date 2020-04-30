'use strict';

setupConnector();

function setupConnector() {
	if (isMainPage()) {
		setupMainPagePlayer();
	} else {
		setupDefaultPlayer();
	}
}

function isMainPage() {
	return location.href === 'http://bandzone.cz/' ||
		location.href === 'https://bandzone.cz/';
}

function setupMainPagePlayer() {
	Connector.playerSelector = '#stats';

	Connector.getTrackInfo = () => {
		const container = getTrackContainer();
		if (container === null) {
			return null;
		}

		const artistNode = container.querySelector('h4');
		const trackNode = container.querySelector('.songTitle');

		const artist = artistNode && artistNode.textContent;
		const track = trackNode && trackNode.textContent;

		return { artist, track };
	};

	Connector.pauseButtonSelector = '.ui-miniaudioplayer-state-playing';
}

function setupDefaultPlayer() {
	const filter = new MetadataFilter({ artist: removeGenre });

	Connector.playerSelector = '#playerWidget';

	Connector.artistSelector = '.profile-name h1';

	Connector.trackSelector = '.ui-state-active .ui-audioplayer-song-title';

	Connector.timeInfoSelector = '.ui-audioplayer-time';

	Connector.isPlaying = () => {
		return Util.getTextFromSelectors('.ui-audioplayer-button') === 'stop';
	};

	Connector.applyFilter(filter);

	function removeGenre(text) {
		const genre = Util.getTextFromSelectors('.profile-name span');
		return text.replace(genre, '');
	}
}

function getTrackContainer() {
	// Iterate through all parents until it also finds a cover art
	const playButtons = document.querySelectorAll('.ui-miniaudioplayer-state-playing');
	for (const button of playButtons) {
		let parent = button.parentElement;
		while (parent) {
			if (parent.querySelector('.textLenght') !== null) {
				return parent;
			}

			parent = parent.parentElement;
		}
	}

	return null;
}
