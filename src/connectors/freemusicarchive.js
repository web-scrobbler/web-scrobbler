'use strict';

const filter = MetadataFilter.createFilter({ track: removeQuotes });

const trackSelectorCommon = '.play-item.gcol-electronic .playtxt a';

const pageSelectors = {
	artist: '.bcrumb h1 .minitag-artist',
	charts: '.page-charts',
	genres: '#bcrumb a[href^="/genre"]',
	album: '.bcrumb h1 .minitag-album',
	song: '.bcrumb h1 .minitag-song',
};

const pageInitFunctions = {
	default: setupDefaultPlayer,
	artist: setupArtistPlayer,
	charts: setupChartsPlayer,
	genres: setupGenresPlayer,
	album: setupAlbumPlayer,
	song: setupSongPlayer,
};

function setupConnector() {
	setupCommonProps();
	setupPage(getPageType());
}

function setupPage(pageType) {
	const initFn = pageInitFunctions[pageType];
	if (typeof initFn !== 'function') {
		Util.debugLog(`Unknown page type: ${pageType}`, 'warn');
		return;
	}

	Util.debugLog(`Setup ${pageType} page`);
	initFn();
}

function getPageType() {
	for (const pageType in pageSelectors) {
		const selector = pageSelectors[pageType];
		if (document.querySelector(selector) !== null) {
			return pageType;
		}
	}

	return 'default';
}

function setupCommonProps() {
	Connector.playerSelector = '#content';

	Connector.pauseButtonSelector = '.playbtn-paused';

	Connector.getUniqueID = () => {
		const playingItem = document.querySelector('.play-item.gcol-electronic');
		if (!playingItem) {
			return null;
		}

		const match = /tid-(\d+)/.exec(playingItem.className);
		if (match) {
			return match[1];
		}
		return null;
	};
}

// https://freemusicarchive.org/music/KieLoKaz
function setupArtistPlayer() {
	Connector.artistSelector = '.bcrumb .txt-drk';

	Connector.trackSelector = trackSelectorCommon;

	Connector.getAlbum = getAlbumCommon;

	Connector.getDuration = getDurationCommon;
}

// https://freemusicarchive.org/music/KieLoKaz/Jazzy_Lazy
function setupAlbumPlayer() {
	Connector.artistSelector = '.subh1 a';

	Connector.trackSelector = trackSelectorCommon;

	Connector.getAlbum = getAlbumCommon;

	Connector.getDuration = getDurationCommon;
}

// https://freemusicarchive.org/music/Monplaisir/Lack_of_Feedback/Monplaisir_-_Lack_of_Feedback_-_01_Bonsoir
function setupSongPlayer() {
	Connector.artistSelector = '.subh1 a';

	Connector.trackSelector = trackSelectorCommon;
}

// https://freemusicarchive.org/music/charts/this-week
function setupChartsPlayer() {
	Connector.artistSelector = '.play-item.gcol-electronic .chartcol-artist a';

	Connector.trackSelector = '.play-item.gcol-electronic .chartcol-track a';

	Connector.albumSelector = '.play-item.gcol-electronic .chartcol-album a';
}

// https://freemusicarchive.org/genre/Blues
function setupGenresPlayer() {
	Connector.artistSelector = '.play-item.gcol-electronic .ptxt-artist a';

	Connector.trackSelector = '.play-item.gcol-electronic .ptxt-track a';

	Connector.albumSelector = '.play-item.gcol-electronic .ptxt-album a';
}

// https://freemusicarchive.org/static
function setupDefaultPlayer() {
	Connector.artistSelector = `${trackSelectorCommon}:nth-child(1)`;

	Connector.trackSelector = `${trackSelectorCommon}:nth-child(2)`;

	Connector.getDuration = getDurationCommon;

	Connector.applyFilter(filter);
}

function getAlbumCommon() {
	const playingItem = document.querySelector('.play-item.gcol-electronic');
	if (playingItem) {
		const albumItem = playingItem.closest('.colr-lrg-10pad');
		if (albumItem) {
			return albumItem.querySelector('.txthd2').textContent;
		}
	}

	return null;
}

function getDurationCommon() {
	const playingItemName = document.querySelector('.play-item.gcol-electronic .playtxt');
	if (playingItemName) {
		const durationStr = playingItemName.lastChild.textContent;
		const match = /\((.+?)\)/.exec(durationStr);
		if (match) {
			return Util.stringToSeconds(match[1]);
		}
	}

	return null;
}

function removeQuotes(text) {
	return text.replace(/^"|"$/g, '');
}

setupConnector();
