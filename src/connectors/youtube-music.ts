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

const adSelector = '.ytmusic-player-bar.advertisement';

/**
 * Official music video uploaded by the artist's own channel.
 * Unlike user-generated videos (MUSIC_VIDEO_TYPE_UGC), the channel name
 * of such videos is the artist name, so it can be trusted.
 */
const MUSIC_VIDEO_TYPE_OMV = 'MUSIC_VIDEO_TYPE_OMV';

const mediaInfo = {
	playbackState: 'none',
	musicVideoType: undefined as string | undefined,
	metadata: {
		title: '',
		artist: '',
		artwork: [{ src: '' }],
		album: '',
	},
};

Connector.onScriptEvent = (event) => {
	mediaInfo.playbackState = event.data.playbackState as string;
	mediaInfo.musicVideoType = event.data.musicVideoType as string | undefined;
	mediaInfo.metadata = event.data.metadata as {
		title: string;
		artist: string;
		artwork: { src: string; size: string; type: string }[];
		album: string;
	};
};

Connector.playerSelector = 'ytmusic-player-bar';

Connector.isTrackArtDefault = (url) => {
	// Self-uploaded tracks could not have cover arts
	return Boolean(url?.includes('cover_track_default'));
};

Connector.getAlbum = () => mediaInfo.metadata?.album;

Connector.getTrackArt = () => {
	const artworks = mediaInfo.metadata?.artwork;
	return artworks?.[artworks.length - 1].src;
};

Connector.getArtistTrack = () => {
	let artist;
	let track;
	const metadata = mediaInfo.metadata;

	if (metadata?.album) {
		artist = metadata.artist;
		track = metadata.title;
	} else if (
		mediaInfo.musicVideoType === MUSIC_VIDEO_TYPE_OMV &&
		metadata.artist
	) {
		({ artist, track } = getArtistTrackFromOfficialVideo(
			metadata.title,
			metadata.artist,
		));
	} else {
		({ artist, track } = Util.processYtVideoTitle(metadata?.title));
		if (!artist) {
			artist = metadata?.artist;
		}
	}
	return { artist, track };
};

/**
 * Official video titles may or may not contain the artist name, e.g.
 * "Sade - Smooth Operator" or "Kiss Of Life - Official - 1993".
 * Use the parsed artist only if it matches the channel artist; otherwise
 * the title starts with the track name, and the channel is the artist.
 */
function getArtistTrackFromOfficialVideo(title: string, channelArtist: string) {
	const parsed = Util.processYtVideoTitle(title);
	if (!parsed.artist || !parsed.track) {
		return { artist: channelArtist, track: parsed.track ?? title };
	}

	const parsedArtist = parsed.artist.toLowerCase();
	const channel = channelArtist.toLowerCase();
	if (parsedArtist.includes(channel) || channel.includes(parsedArtist)) {
		return parsed;
	}

	return { artist: channelArtist, track: parsed.artist };
}

Connector.timeInfoSelector = '.ytmusic-player-bar.time-info';

Connector.isPlaying = () => mediaInfo.playbackState === 'playing';

Connector.loveButtonSelector =
	'ytmusic-like-button-renderer #button-shape-like button[aria-pressed="false"]';

Connector.unloveButtonSelector =
	'ytmusic-like-button-renderer #button-shape-like button[aria-pressed="true"]';

Connector.getUniqueID = () => {
	const uniqueId = new URLSearchParams(window.location.search).get('v');

	if (uniqueId) {
		return uniqueId;
	}

	const videoUrl = Util.getAttrFromSelectors('.yt-uix-sessionlink', 'href');
	return Util.getYtVideoIdFromUrl(videoUrl);
};

Connector.scrobblingDisallowedReason = () =>
	Util.isElementVisible(adSelector) ? 'IsAd' : null;

function filterYoutubeIfNonAlbum(text: string) {
	return Connector.getAlbum() ? text : MetadataFilter.youtube(text);
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

Connector.injectScript('connectors/youtube-music-dom-inject.js');
