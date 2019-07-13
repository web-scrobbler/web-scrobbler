'use strict';

const VARIOUS_ARTISTS_REGEXPS = [
	/variou?s(\sartists)?/i,
	/letiou?s(\sartists)?/i
];

/**
 * List of separators used to split ArtistTrack string of LetiousArtists albums.
 * @type {Array}
 */
const SEPARATORS = [' - ', ' | '];

const filter = new MetadataFilter({
	all: MetadataFilter.removeZeroWidth,
});

$('audio').bind('playing pause timeupdate', Connector.onStateChanged);

if (isAlbumPage()) {
	Util.debugLog('Init props for album player');

	initPropertiesForAlbumPlayer();
} else if (isSongPage()) {
	/*
	 * The song page has almost the same selectors
	 * as the album page, but we override some of them.
	 */
	Util.debugLog('Init props for song player');

	initPropertiesForAlbumPlayer();
	initPropertiesForSongPlayer();
} else if (isCollectionsPage()) {
	Util.debugLog('Init props for collections player');

	initPropertiesForCollectionsPlayer();
} else {
	Util.debugLog('Init props for home page');

	initPropertiesForHomePage();
}

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

Connector.isPlaying = () => $('.playing').length > 0;

/*
 * Default implementation for all pages except home page.
 */
Connector.getUniqueID = () => {
	const audioSrc = $('audio').first().attr('src');
	const audioIdMatch = /&id=(\d+)&/.exec(audioSrc);

	return audioIdMatch ? audioIdMatch[1] : null;
};

Connector.applyFilter(filter);

// Example: https://northlane.bandcamp.com/album/mesmer
function initPropertiesForAlbumPlayer() {
	// This selector won't be used for Various Artists compilations
	Connector.artistSelector = 'span[itemprop=byArtist]';

	Connector.albumArtistSelector = 'span[itemprop="byArtist"]';

	Connector.trackSelector = '.track_info .title';

	Connector.albumSelector = 'h2.trackTitle';

	Connector.currentTimeSelector = '.time_elapsed';

	Connector.durationSelector = '.time_total';

	Connector.trackArtSelector = '#tralbumArt > a > img';
}

// Example: https://dansarecords.bandcamp.com/track/tribal-love-tribal-dirt-mix
function initPropertiesForSongPlayer() {
	Connector.trackSelector = 'h2.trackTitle';

	Connector.albumSelector = '[itemprop="inAlbum"] [itemprop="name"]';
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
		'.track_info .title'
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
		if ($('.bcweekly.playing').length) {
			const pageData = $('#pagedata').data('blob');

			const showId = pageData.bcw_show.show_id;
			const currentShowId = +location.search.match(/show=(\d+)?/)[1];

			if (currentShowId === showId) {
				const currentTrackIndex = $('.bcweekly-current').data('index');
				return pageData.bcw_show.tracks[currentTrackIndex].track_id;
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

function isCollectionsPage() {
	return $('#carousel-player').length > 0;
}

function isArtistVarious(artist, track) {
	/*
	 * Return true if all tracks contain a hyphen or vertical bar on album page.
	 * Example: https://krefeld8ung.bandcamp.com/album/krefeld-8ung-vol-1
	 */
	if (isAlbumPage()) {
		const trackNodes = $('.track_list span[itemprop="name"]').toArray();
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
	return $('meta[property="og:type"]').attr('content');
}

/*
 * Legacy selectors:
 *  a) artistSelector:
 *   - .detail_item_link_2
 *   - .waypoint-artist-title (substr(3))
 *  b) trackSelector:
 *   - .collection-item-container.playing .fav-track-static
 *   - .waypoint-item-title
 *  c) albumSelector:
 *   - .detail_item_link
 */
