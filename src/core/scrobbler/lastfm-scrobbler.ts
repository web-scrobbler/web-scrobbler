'use strict';

/**
 * Module for all communication with L.FM
 */
define((require) => {
	const AudioScrobbler = require('scrobbler/audio-scrobbler');
	const ServiceCallResult = require('object/service-call-result');


	const cleanVariousArtistsFilter = (text) => {
		return text.includes('Various Artists') ? 'Various Artists' : text;
	};

	class LastFmScrobbler extends AudioScrobbler {
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
		async getSongInfo(song) {
			const params = {
				track: song.getTrack(),
				artist: song.getArtist(),
				method: 'track.getinfo',
			};

			try {
				const { sessionName } = await this.getSession();
				params.username = sessionName;
			} catch (e) {
				// Do nothing
			}

			if (song.getAlbum()) {
				params.album = song.getAlbum();
			}

			const responseData = await this.sendRequest(
				{ method: 'GET' },
				params,
				false
			);
			const result = AudioScrobbler.processResponse(responseData);
			if (result !== ServiceCallResult.RESULT_OK) {
				throw new Error('Unable to load song info');
			}

			const data = this.parseSongInfo(responseData);
			if (this.canLoveSong() && data) {
				song.setLoveStatus(data.userloved);
			}

			return data;
		}

		/** @override */
		canLoadSongInfo() {
			return true;
		}

		/**
		 * Parse service response and return parsed data.
		 * @param  {Object} responseData Last.fm response data
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

		/** @override */
		applyFilter(song) {

			/**
			 * Last.fm rejects track if album artist contains more then just "Various Artists"
			 */
			if (song.getAlbumArtist()) {
				song.parsed.albumArtist = cleanVariousArtistsFilter(song.getAlbumArtist());
			}

			return song;
		}
	}

	return LastFmScrobbler;
});
