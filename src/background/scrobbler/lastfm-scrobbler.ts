import AudioScrobbler, {
	AudioScrobblerApiParams,
	AudioScrobblerImage,
	AudioScrobblerResponse,
} from '@/background/scrobbler/audio-scrobbler';

import { ScrobblerSongInfo } from '@/background/scrobbler/base-scrobbler';
import { SongInfo } from '@/background/object/song';

export default class LastFmScrobbler extends AudioScrobbler {
	/** @override */
	getApiUrl(): string {
		return 'https://ws.audioscrobbler.com/2.0/';
	}

	/** @override */
	getApiKey(): string {
		return 'd9bb1870d3269646f740544d9def2c95';
	}

	/** @override */
	getApiSecret(): string {
		return '2160733a567d4a1a69a73fad54c564b2';
	}

	/** @override */
	getBaseAuthUrl(): string {
		return 'https://www.last.fm/api/auth/';
	}

	/** @override */
	getBaseProfileUrl(): string {
		return 'https://last.fm/user/';
	}

	/** @override */
	getId(): string {
		return 'lastfm';
	}

	/** @override */
	getLabel(): string {
		return 'Last.fm';
	}

	/** @override */
	getStatusUrl(): string {
		return 'http://status.last.fm/';
	}

	/** @override */
	getStorageName(): string {
		return 'LastFM';
	}

	/** @override */
	async getSongInfo(songInfo: SongInfo): Promise<ScrobblerSongInfo> {
		const { artist, track, album } = songInfo;

		const params: AudioScrobblerApiParams = {
			track,
			artist,
			method: 'track.getinfo',
		};

		try {
			const { sessionName } = await this.getSession();
			params.username = sessionName;
		} catch (e) {
			// Do nothing
		}

		if (album) {
			params.album = album;
		}

		const responseData = await this.sendRequest({ method: 'GET' }, params, {
			signed: false,
		});
		this.processResponse(responseData);
		return this.parseSongInfo(responseData);
	}

	/** @override */
	canLoadSongInfo(): boolean {
		return true;
	}

	/**
	 * Parse service response and return parsed data.
	 * @param responseData Last.fm response data
	 * @return Parsed song info
	 */
	parseSongInfo(responseData: AudioScrobblerResponse): ScrobblerSongInfo {
		const trackInfo = responseData.track;
		const albumInfo = responseData.track.album;
		const artistInfo = responseData.track.artist;

		const artist = artistInfo.name;
		const artistUrl = artistInfo.url;
		const track = trackInfo.name;
		const trackUrl = trackInfo.url;
		const duration = parseInt(trackInfo.duration) / 1000 || null;
		const userPlayCount = parseInt(trackInfo.userplaycount) || 0;

		const result: ScrobblerSongInfo = {
			songInfo: {
				artist,
				track,
				duration,
			},
			metadata: {
				artistUrl,
				trackUrl,
				userPlayCount,
			},
		};

		const userlovedStatus = trackInfo.userloved;
		if (userlovedStatus) {
			result.metadata.userloved = userlovedStatus === '1';
		}

		if (albumInfo) {
			result.songInfo.album = albumInfo.title;
			result.metadata.albumUrl = albumInfo.url;
			result.metadata.albumMbId = albumInfo.mbid;

			if (Array.isArray(albumInfo.image)) {
				result.metadata.trackArtUrl = getAlbumArtFromResponse(
					albumInfo.image
				);
			}
		}

		return result;
	}
}

const imageSizes = ['extralarge', 'large', 'medium'];

function getAlbumArtFromResponse(images: AudioScrobblerImage[]): string {
	/*
	 * Convert an array from response to an object.
	 * Format is the following: { size: "url", ... }.
	 */
	const imagesMap: Record<string, string> = images.reduce((result, image) => {
		result[image.size] = image['#text'];
		return result;
	}, {});

	for (const imageSize of imageSizes) {
		const url = imagesMap[imageSize];
		if (url) {
			return url;
		}
	}

	return null;
}
