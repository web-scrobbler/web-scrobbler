'use strict';

const trackArtSelector = '.ytmusic-player-bar.image';
const artistSelectors = [
	'.ytmusic-player-bar.byline [href^=channel]',
	'.ytmusic-player-bar.byline [href*="browse/FEmusic_library_privately_owned_artist_detaila_"]',
];

const trackSelector = '.ytmusic-player-bar.title';
const adSelector = '.ytmusic-player-bar.advertisement';

const playButtonSelector =
	'.ytmusic-player-bar.play-pause-button #icon > svg > g > path';
const playingPath = 'M6 19h4V5H6v14zm8-14v14h4V5h-4z';

Connector.playerSelector = 'ytmusic-player-bar';

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(trackArtSelector);
	if (trackArtUrl) {
		return trackArtUrl.substring(0, trackArtUrl.lastIndexOf('='));
	}
	return null;
};

Connector.albumSelector = [
	'.ytmusic-player-bar .yt-formatted-string.style-scope.yt-simple-endpoint[href*="browse/MPREb_"]',
	'.ytmusic-player-bar .yt-formatted-string.style-scope.yt-simple-endpoint[href*="browse/FEmusic_library_privately_owned_release_detailb_"]',
];

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
			Util.getTextFromSelectors(trackSelector)
		));
		if (!artist) {
			artist = getArtists();
		}
	}
	return { artist, track };
};

Connector.timeInfoSelector = '.ytmusic-player-bar.time-info';

Connector.isPlaying = () => {
	return Util.getAttrFromSelectors(playButtonSelector, 'd') === playingPath;
};

Connector.isScrobblingAllowed = () => !Util.isElementVisible(adSelector);

function getArtists() {
	// FIXME Use Array.from after jQuery support will be removed
	const artistElements = Util.queryElements(artistSelectors);
	return artistElements && Util.joinArtists(artistElements.toArray());
}

function filterYoutubeIfNonAlbum(text) {
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
