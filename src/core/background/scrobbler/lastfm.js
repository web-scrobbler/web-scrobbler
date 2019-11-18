'use strict';

/**
 * Module for all communication with L.FM
 */
define((require) => {
	const AudioScrobbler = require('scrobbler/audioscrobbler');

	class LastFm extends AudioScrobbler {
		/** @override */
		async getSongInfo(song) {
			let params = {
				track: song.getTrack(),
				artist: song.getArtist(),
				method: 'track.getinfo',
			};

			try {
				let { sessionName } = await this.getSession();
				params.username = sessionName;
			} catch (e) {
				// Do nothing
			}

			if (song.getAlbum()) {
				params.album = song.getAlbum();
			}

			let responseData = await this.sendRequest({ method: 'GET' }, params, false);
			let result = AudioScrobbler.processResponse(responseData);
			if (!result.isOk()) {
				throw new Error('Unable to load song info');
			}

			let data = this.parseSongInfo(responseData);
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

			songInfo.duration = (parseInt(trackInfo.duration) / 1000) || null;

			if (albumInfo) {
				songInfo.album = albumInfo.name;
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

	return new LastFm({
		label: 'Last.fm',
		storage: 'LastFM',
		apiUrl: 'https://ws.audioscrobbler.com/2.0/',
		apiKey: 'd9bb1870d3269646f740544d9def2c95',
		apiSecret: '2160733a567d4a1a69a73fad54c564b2',
		authUrl: 'https://www.last.fm/api/auth/',
		statusUrl: 'http://status.last.fm/',
		profileUrl: 'https://last.fm/user/',
	});
});
