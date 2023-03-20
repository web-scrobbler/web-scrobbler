'use strict';

const VARIOUS_ARTISTS_REGEXP = /variou?s\sartists?/i;

/**
 * List of separators used to split ArtistTrack string of VariousArtists albums.
 * @type {Array}
 */
const SEPARATORS = [' - ', ' | '];

/**
 * This filter is applied after all page properties are inititialized.
 */
let bandcampFilter = MetadataFilter.createFilter(
	MetadataFilter.createFilterSetForFields(
		['artist', 'track', 'album', 'albumArtist'],
		MetadataFilter.removeZeroWidth
	)
);

setupConnector();

/**
 * Entry point.
 */
function setupConnector() {
	initEventListeners();
	initGenericProperties();

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

	// Apply the filter at the end to allow extend it in setup functions
	Connector.applyFilter(bandcampFilter);
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
		let track = Util.getTextFromSelectors(Connector.trackSelector);

		if (isArtistVarious(artist, track)) {
			return Util.splitArtistTrack(track, SEPARATORS);
		}
		if (trackContainsRecordSide()) {
			track = Util.removeRecordSide(track);
		}

		return { artist, track };
	};

	Connector.isPlaying = () => document.querySelector('.playing') !== null;

	Connector.getUniqueID = () => {
		const audioElements = document.getElementsByTagName('audio');
		for (const audioElement of audioElements) {
			const audioSrc = audioElement.getAttribute('src');
			if (!audioSrc) {
				continue;
			}

			const audioIdMatch = /&id=(\d+)&/.exec(audioSrc);
			return audioIdMatch && audioIdMatch[1];
		}

		return null;
	};

	Connector.getOriginUrl = () => document.location.href.split('?')[0];
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

	Connector.getOriginUrl = () => Util.getOriginUrl('.playing .collection-title-details a, .playing .buy-now a');
}

// https://bandcamp.com/%YOURNAME%/feed
function initPropertiesForFeedPlayer() {
	bandcampFilter = bandcampFilter.extend(MetadataFilter.createFilter({
		artist: [removeByPrefix],
	}));

	Connector.artistSelector = '.waypoint-artist-title';

	Connector.trackSelector = '.waypoint-item-title';

	Connector.trackArtSelector = '#track_play_waypoint img';

	Connector.playButtonSelector = '#track_play_waypoint.playing';

	Connector.getOriginUrl = () => Util.getOriginUrl('.playing .buy-now a');

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


	Connector.getOriginUrl = () => Util.getOriginUrl('.playable.playing[href], .playable.playing + a');
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

function getTrackNodes() {
	let trackNodes = [];
	if (isAlbumPage()) {
		trackNodes = document.querySelectorAll('.track_list .track-title');
	} else if (isCollectionsPage()) {
		trackNodes = document.querySelectorAll('.queue .title span:nth-child(2)');
	}

	return trackNodes;
}

function isArtistVarious(artist, track) {
	const trackNodes = getTrackNodes();
	/*
	* Return true if all tracks contain a hyphen or vertical bar on album page.
	* Example: https://krefeld8ung.bandcamp.com/album/krefeld-8ung-vol-1
	*/
	if (trackNodes.length !== 0) {
		const artists = [];
		for (const trackNode of trackNodes) {
			const trackName = trackNode.textContent;
			if (!Util.findSeparator(trackName, SEPARATORS)) {
				return false;
			}
			const { artist } = Util.splitArtistTrack(trackName, SEPARATORS);
			artists.push(artist);
		}
		/*
		 * Return false if every detected artist on the album has a very short name.
		 * It is probably not artist names but disc sides or some kind of numbers.
		 * Example: https://teenagemenopause.bandcamp.com/album/viens-mourir
		 */
		if (artists.every((artist) => artist.length <= 2)) {
			return false;
		}

		return true;
	}

	/*
	 * Return true if artist is various, and track contains
	 * a hyphen or vertical bar on song and collections page.
	 * Example: https://krefeld8ung.bandcamp.com/track/chrome
	 */

	if (VARIOUS_ARTISTS_REGEXP.test(artist)) {
		return Util.findSeparator(track, SEPARATORS) !== null;
	}

	return false;
}

function trackContainsRecordSide() {
	const trackNodes = getTrackNodes();
	let numTracksWithRecordSide = 0;

	for (const trackNode of trackNodes) {
		const trackName = trackNode.textContent;
		if (trackName.substring(0, 3).match(Util.RECORD_SIDE_REGEX) || trackName.substring(0, 4).match(Util.RECORD_SIDE_REGEX)) {
			numTracksWithRecordSide++;
		}
	}

	// return true if all tracks on the album page contain a record side
	return numTracksWithRecordSide === trackNodes.length;
}

function getPageType() {
	return Util.getAttrFromSelectors('meta[property="og:type"]', 'content');
}

function initEventListeners() {
	const events = ['playing', 'pause', 'timeupdate'];
	const audioElements = document.getElementsByTagName('audio');

	for (const event of events) {
		for (const audioElement of audioElements) {
			audioElement.addEventListener(event, Connector.onStateChanged);
		}
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
