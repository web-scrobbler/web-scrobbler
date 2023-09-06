import type { ArtistTrackInfo } from '@/core/types';

export {};

const ALLOWED_TYPES = ['video.other', 'video.episode'];

const ARTIST_TRACK_GETTERS = ['videoTitle', 'pageTitle', 'description'];

/**
 * for video episode page title in the form of
 * Programme: Track by Artist
 * eg. https://www.redbull.com/int-en/videos/episode-3-full-track-video-check-your-dms
 */
const PAGE_TITLE_REG_EXP = {
	pattern: /(.+)\sby\s([^-–]+)/,
	groups: { artist: 2, track: 1 },
};

let artistTrack: ArtistTrackInfo = {
	artist: null,
	track: null,
};

Connector.playerSelector = '#app';

Connector.currentTimeSelector = '.rbPlyr-timeElapsed';

Connector.durationSelector = '.rbPlyr-timeDuration';

Connector.getUniqueID = () => {
	const text = Util.getAttrFromSelectors(
		'[data-content-id]',
		'data-content-id'
	);
	return text && text.split(':').at(-2);
};

Connector.getArtistTrack = () => {
	for (const getter of ARTIST_TRACK_GETTERS) {
		artistTrack = getArtistTrackFrom(getter);

		if (!Util.isArtistTrackEmpty(artistTrack)) {
			break;
		}
	}

	return artistTrack;
};

Connector.playButtonSelector = 'rbPlyr-playPause:not(.rbPlyr-pause)';

Connector.isScrobblingAllowed = () => {
	const pageType = Util.getAttrFromSelectors(
		'meta[property="og:type"]',
		'content'
	);

	const categoryLink = Util.getAttrFromSelectors('a[href*="/tags/"]', 'href');

	return Boolean(
		pageType &&
			ALLOWED_TYPES.includes(pageType) &&
			categoryLink &&
			'music' === categoryLink.split('/').pop()
	);
};

function getArtistTrackFrom(getter: string) {
	// escape special characters for regExp
	const track =
		artistTrack.track &&
		artistTrack.track.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	if (getter === 'videoTitle') {
		// Example: https://www.redbull.com/int-en/episodes/red-bull-records-the-aces-daydream
		const text = Util.getAttrFromSelectors(
			'meta[property="og:title"]',
			'content'
		);

		if (!text) {
			return artistTrack;
		}
		artistTrack = Util.splitArtistTrack(text);

		if (Util.isArtistTrackEmpty(artistTrack)) {
			artistTrack = Util.processYtVideoTitle(text);
		}

		if (Util.isArtistTrackEmpty(artistTrack)) {
			artistTrack.track = text;
		}
	} else if (getter === 'pageTitle') {
		// Example: see Line 14
		const pageTitle = Util.getTextFromSelectors('title');
		const text =
			pageTitle &&
			pageTitle
				.split(':')
				.at(-1)
				?.replace(/( music)? video$/i, '');

		if (!text || !text.match(track ?? '')) {
			return artistTrack;
		}
		const regPage = text.match(PAGE_TITLE_REG_EXP.pattern);

		if (regPage) {
			artistTrack.artist = regPage[PAGE_TITLE_REG_EXP.groups.artist];
		}

		if (Util.isArtistTrackEmpty(artistTrack)) {
			const ytResult = Util.processYtVideoTitle(text);

			if (ytResult.track?.match(track ?? '')) {
				artistTrack.artist = ytResult.artist;
			} else if (ytResult.artist?.match(track ?? '')) {
				artistTrack.artist = ytResult.track;
			}
		}
	} else if (getter === 'description') {
		// Example: https://www.redbull.com/int-en/videos/check-your-dms-s1-e2-full-track-video
		const text = Util.getAttrFromSelectors(
			'meta[property="og:description"]',
			'content'
		);

		if (!text) {
			return artistTrack;
		}

		const regDesc = text.match(new RegExp(`(.*)${track}(.*)`));

		if (!regDesc) {
			return artistTrack;
		}

		const regResult = regDesc[2].match(/\bby\b(.*[^.])\.?/);

		if (regResult) {
			artistTrack.artist = regResult[1];
		} else if (regDesc[1]) {
			artistTrack.artist = regDesc[1]?.match(/(.*)\b.+\b/)?.[1];
		}
	}
	return artistTrack;
}
