'use strict';

const VARIOUS_ARTISTS_REGEXPS = [
	/variou?s(\sartists)?/i,
	/letiou?s(\sartists)?/i,
];

/**
 * List of separators used to split ArtistTrack string of LetiousArtists albums.
 * @type {Array}
 */
const SEPARATORS = [' - ', ' | '];

/**
 * This filter is applied after all page properties are inititialized.
 */
let bandcampFilter = new MetadataFilter({
	all: MetadataFilter.removeZeroWidth,
});

const audioElement = document.getElementsByTagName('audio')[0];

setupConnector();

/**
 * Entry point.
 */
function setupConnector() {
	initEventListeners();

	/*
	 * Default implementation for all pages except home page.
	 */
	Connector.getUniqueID = () => {
		const audioSrc = audioElement.getAttribute('src');
		const audioIdMatch = /&id=(\d+)&/.exec(audioSrc);

		return audioIdMatch ? audioIdMatch[1] : null;
	};

	if (isAlbumPage()) {
		Util.debugLog('Init props for album player');

		initPropertiesForSongAndAlbumPlayer();
		initPropertiesForAlbumPlayer();
	} else if (isSongPage()) {
		Util.debugLog('Init props for song player');

		initPropertiesForSongAndAlbumPlayer();
		initPropertiesForSongPlayer();
	} else if (isCollectionsPage()) {
		Util.debugLog('Init props for collections player');

		initPropertiesForCollectionsPlayer();
	} else if (isFeedPage()) {
		Util.debugLog('Init props for feed player');

		initPropertiesForFeedPlayer();
	} else {
		Util.debugLog('Init props for home page');

		initPropertiesForHomePage();
	}

	initGenericProperties();
}

/**
 * Initialize properties for all connectors.
 */
function initGenericProperties() {
	// Override getters to get high priority for `Connector.getArtistTrack`;
	Connector.getArtist = () => null;
	Connector.getTrack = () => null;

	Connector.getArtistTrack = () => {
		const artist = Util.getTextFromSelectors(Connector.artistSelector);
		const track = Util.getTextFromSelectors(Connector.trackSelector);

		if (isArtistVarious(artist, track)) {
			return Util.splitArtistTrack(track, SEPARATORS);
		}
		return { artist, track };
	};

	Connector.isPlaying = () => document.querySelector('.playing') !== null;

	Connector.applyFilter(bandcampFilter);
}

// Example: https://northlane.bandcamp.com/album/mesmer
function initPropertiesForAlbumPlayer() {
	// This selector won't be used for Various Artists compilations
	Connector.artistSelector = '#name-section a';

	Connector.albumArtistSelector = '#name-section a';

	Connector.trackSelector = '.title-section .title';

	Connector.albumSelector = '#name-section .trackTitle';
}

// Example: https://dansarecords.bandcamp.com/track/tribal-love-tribal-dirt-mix
function initPropertiesForSongPlayer() {
	Connector.artistSelector = '.albumTitle span:last-of-type a';

	Connector.albumArtistSelector = '.albumTitle span:last-of-type a';

	Connector.trackSelector = '#name-section .trackTitle';

	Connector.albumSelector = '#name-section .fromAlbum';
}

function initPropertiesForSongAndAlbumPlayer() {
	Connector.currentTimeSelector = '.time_elapsed';

	Connector.durationSelector = '.time_total';

	Connector.trackArtSelector = '#tralbumArt > a > img';
}

// Example: https://bandcamp.com/tag/discovery
// Example: https://bandcamp.com/mycollection
function initPropertiesForCollectionsPlayer() {
	Connector.artistSelector = '.now-playing .artist span';

	Connector.trackSelector = '.info-progress .title span:nth-child(2)';

	Connector.albumSelector = '.now-playing .title';

	Connector.timeInfoSelector = '.pos-dur';

	Connector.trackArtSelector = '.now-playing img';
}

// https://bandcamp.com/%YOURNAME%/feed
function initPropertiesForFeedPlayer() {
	bandcampFilter = bandcampFilter.extend(new MetadataFilter({
		artist: [removeByPrefix],
	}));

	Connector.artistSelector = '.waypoint-artist-title';

	Connector.trackSelector = '.waypoint-item-title';

	Connector.trackArtSelector = '#track_play_waypoint img';

	Connector.playButtonSelector = '#track_play_waypoint.playing';

	function removeByPrefix(text) {
		return text.replace('by ', '');
	}
}

// Example: https://bandcamp.com/?show=47
function initPropertiesForHomePage() {
	/*
	 * Home page actually contains two players, and
	 * we have selectors for both players.
	 */

	const weeklyPlayerContext = '.bcweekly.playing ~ .bcweekly-info';

	Connector.artistSelector = [
		`${weeklyPlayerContext} .bcweekly-current .track-artist a`,
		'.detail-artist a',
	];

	Connector.trackSelector = [
		`${weeklyPlayerContext} .bcweekly-current .track-title`,
		'.track_info .title',
	];

	Connector.albumSelector = [
		`${weeklyPlayerContext} .bcweekly-current .track-album`,
		'.detail-album',
	];

	Connector.trackArtSelector = [
		`${weeklyPlayerContext} .bcweekly-current .ratio-1-1`,
		'.discover-detail-inner img',
	];

	Connector.getUniqueID = () => {
		if (document.querySelector('.bcweekly.playing') !== null) {
			const { bcw_data: bandcampWeeklyData } = getData('#pagedata', 'data-blob');
			const currentShowId = location.search.match(/show=(\d+)?/)[1];

			if (currentShowId in bandcampWeeklyData) {
				const currentShowData = bandcampWeeklyData[currentShowId];
				const currentTrackIndex = Util.getAttrFromSelectors('.bcweekly-current', 'data-index');

				return currentShowData.tracks[currentTrackIndex].track_id;
			}
		}

		return null;
	};
}

function isAlbumPage() {
	return getPageType() === 'album';
}

function isSongPage() {
	return getPageType() === 'song';
}

function isFeedPage() {
	return getPageType() === 'profile';
}

function isCollectionsPage() {
	return document.querySelector('#carousel-player') !== null;
}

function isArtistVarious(artist, track) {
	/*
	 * Return true if all tracks contain a hyphen or vertical bar on album page.
	 * Example: https://krefeld8ung.bandcamp.com/album/krefeld-8ung-vol-1
	 */
	if (isAlbumPage()) {
		const trackNodes = document.querySelectorAll('.track_list .track-title');
		for (const trackNode of trackNodes) {
			const trackName = trackNode.textContent;
			if (!Util.findSeparator(trackName, SEPARATORS)) {
				return false;
			}
		}

		return true;
	}

	/*
	 * Return true if artist is various, and track contains
	 * a hyphen or vertical bar on song and collections page.
	 * Example: https://krefeld8ung.bandcamp.com/track/chrome
	 */

	for (const regex of VARIOUS_ARTISTS_REGEXPS) {
		if (regex.test(artist)) {
			return Util.findSeparator(track, SEPARATORS) !== null;
		}
	}

	return false;
}

function getPageType() {
	return Util.getAttrFromSelectors('meta[property="og:type"]', 'content');
}

function initEventListeners() {
	const events = ['playing', 'pause', 'timeupdate'];
	for (const event of events) {
		audioElement.addEventListener(event, Connector.onStateChanged);
	}
}

function getData(selector, attr) {
	const element = document.querySelector(selector);
	if (element) {
		const rawData = element.getAttribute(attr);
		return JSON.parse(rawData);
	}

	return {};
}
