export {};

/**
 * Quick links to debug and test the connector:
 *
 * https://music.youtube.com/playlist?list=OLAK5uy_kDEvxPASaVnoSjOZViKEn4S3iVaueN0UI
 * Multiple artists
 *
 * https://music.youtube.com/playlist?list=OLAK5uy_k-OR_rCdS5UNV22eIhAOWLMZbbxa20muQ
 * Auto-generated YouTube video (and generic track on YouTube Music)
 *
 * https://music.youtube.com/watch?v=Ap1fDjCXQrU
 * Regular YouTube video which contains artist and track names in video title
 *
 * https://music.youtube.com/watch?v=hHrvuQ4DwJ8
 * Regular YouTube video which contains track name in video title and
 * artist name as a channel name
 *
 * https://music.youtube.com/library/uploaded_songs
 * Uploaded songs have different artist and track selectors
 */

const trackArtSelector = '.ytmusic-player-bar.image';

const artistSelectors = [
	// Base selector, combining both new and old
	'.ytmusic-player-bar.byline [href*="channel/"]:not([href*="channel/MPREb_"]):not([href*="browse/MPREb_"])',

	// Old selector for self-uploaded music
	'.ytmusic-player-bar.byline [href*="feed/music_library_privately_owned_artist_detaila_"]',

	// New selector for self-uploaded music
	'.ytmusic-player-bar.byline [href*="browse/FEmusic_library_privately_owned_artist_detaila_"]',
];
const albumSelectors = [
	// Old base selector, leaving in case removing it would break something
	'.ytmusic-player-bar [href*="channel/MPREb_"]',

	// New base selector
	'.ytmusic-player-bar [href*="browse/MPREb_"]',

	// Old selector for self-uploaded music, also leaving for now
	'.ytmusic-player-bar [href*="feed/music_library_privately_owned_release_detailb_"]',

	// New selector for self-uploaded music
	'.ytmusic-player-bar [href*="browse/FEmusic_library_privately_owned_release_detailb_"]',
];

const trackSelector = '.ytmusic-player-bar.title';
const adSelector = '.ytmusic-player-bar.advertisement';

const playButtonSelector =
	'.ytmusic-player-bar.play-pause-button #icon > svg > g > path';
const playingPaths = [
	'M9,19H7V5H9ZM17,5H15V19h2Z', // New design being rolled out
	'M6 19h4V5H6v14zm8-14v14h4V5h-4z',
];

Connector.playerSelector = 'ytmusic-player-bar';

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(trackArtSelector);
	if (trackArtUrl) {
		return trackArtUrl.substring(0, trackArtUrl.lastIndexOf('='));
	}
	return null;
};

Connector.isTrackArtDefault = (url) => {
	// Self-uploaded tracks could not have cover arts
	return Boolean(url?.includes('cover_track_default'));
};

Connector.albumSelector = albumSelectors;

function hasVideoAlbum() {
	return !!Connector.getAlbum();
}

Connector.getArtistTrack = () => {
	let artist;
	let track;

	if (hasVideoAlbum()) {
		artist = getArtists();
		track = Util.getTextFromSelectors(trackSelector);
	} else {
		({ artist, track } = Util.processYtVideoTitle(
			Util.getTextFromSelectors(trackSelector),
		));
		if (!artist) {
			artist = getArtists();
		}
	}
	return { artist, track };
};

Connector.timeInfoSelector = '.ytmusic-player-bar.time-info';

Connector.isPlaying = () => {
	return playingPaths.includes(
		Util.getAttrFromSelectors(playButtonSelector, 'd') ?? '',
	);
};

Connector.getUniqueID = () => {
	const videoUrl = Util.getAttrFromSelectors('.yt-uix-sessionlink', 'href');

	if (videoUrl) {
		return Util.getYtVideoIdFromUrl(videoUrl);
	}
	return null;
};

Connector.isScrobblingAllowed = () => !Util.isElementVisible(adSelector);

function getArtists() {
	// FIXME Use Array.from after jQuery support will be removed
	const artistElements = Util.queryElements(artistSelectors);
	return artistElements && Util.joinArtists([...artistElements]);
}

function filterYoutubeIfNonAlbum(text: string) {
	return hasVideoAlbum() ? text : MetadataFilter.youtube(text);
}

const youtubeMusicFilter = MetadataFilter.createFilter({
	track: [
		filterYoutubeIfNonAlbum,
		MetadataFilter.removeRemastered,
		MetadataFilter.removeLive,
	],
	album: [MetadataFilter.removeRemastered, MetadataFilter.removeLive],
});

Connector.applyFilter(youtubeMusicFilter);
