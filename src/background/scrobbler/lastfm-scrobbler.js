import AudioScrobbler from '@/background/scrobbler/audio-scrobbler';

export default class LastFmScrobbler extends AudioScrobbler {
	/** @override */
	getApiUrl() {
		return 'https://ws.audioscrobbler.com/2.0/';
	}

	/** @override */
	getApiKey() {
		return 'd9bb1870d3269646f740544d9def2c95';
	}

	/** @override */
	getApiSecret() {
		return '2160733a567d4a1a69a73fad54c564b2';
	}

	/** @override */
	getBaseAuthUrl() {
		return 'https://www.last.fm/api/auth/';
	}

	/** @override */
	getBaseProfileUrl() {
		return 'https://last.fm/user/';
	}

	/** @override */
	getId() {
		return 'lastfm';
	}

	/** @override */
	getLabel() {
		return 'Last.fm';
	}

	/** @override */
	getStatusUrl() {
		return 'http://status.last.fm/';
	}

	/** @override */
	getStorageName() {
		return 'LastFM';
	}

	/** @override */
	async getSongInfo(songInfo) {
		const { artist, track, album } = songInfo;

		const params = {
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

		const responseData = await this.sendRequest(
			{ method: 'GET' },
			params,
			false
		);
		this.processResponse(responseData);
		return this.parseSongInfo(responseData);
	}

	/** @override */
	canLoadSongInfo() {
		return true;
	}

	/**
	 * Parse service response and return parsed data.
	 * @param {Object} responseData Last.fm response data
	 * @return {Object} Parsed song info
	 */
	parseSongInfo(responseData) {
		const songInfo = {};

		const trackInfo = responseData.track;
		const albumInfo = responseData.track.album;
		const artistInfo = responseData.track.artist;

		const userlovedStatus = trackInfo.userloved;
		if (userlovedStatus) {
			songInfo.userloved = userlovedStatus === '1';
		} else {
			songInfo.userloved = undefined;
		}

		songInfo.artist = artistInfo.name;
		songInfo.artistUrl = artistInfo.url;

		songInfo.track = trackInfo.name;
		songInfo.trackUrl = trackInfo.url;

		songInfo.duration = parseInt(trackInfo.duration) / 1000 || null;

		if (albumInfo) {
			songInfo.album = albumInfo.title;
			songInfo.albumUrl = albumInfo.url;
			songInfo.albumMbId = albumInfo.mbid;

			if (Array.isArray(albumInfo.image)) {
				/*
				 * Convert an array from response to an object.
				 * Format is the following: { size: "url", ... }.
				 */
				const images = albumInfo.image.reduce((result, image) => {
					result[image.size] = image['#text'];
					return result;
				}, {});

				const imageSizes = ['extralarge', 'large', 'medium'];
				for (const imageSize of imageSizes) {
					const url = images[imageSize];
					if (url) {
						songInfo.trackArtUrl = url;
						break;
					}
				}
			}
		}

		songInfo.userPlayCount = parseInt(trackInfo.userplaycount) || 0;

		return songInfo;
	}
}
