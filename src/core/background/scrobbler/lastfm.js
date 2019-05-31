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

			let $doc = await this.sendRequest('GET', params, false);
			let result = AudioScrobbler.processResponse($doc);
			if (!result.isOk()) {
				throw new Error('Unable to load song info');
			}

			let data = this.parseSongInfo($doc);
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
		 * @param  {Object} $doc Response that parsed by jQuery
		 * @return {Object} Parsed song info
		 */
		parseSongInfo($doc) {
			if ($doc.find('lfm').attr('status') !== 'ok') {
				return null;
			}

			let userloved = undefined;
			let userlovedStatus = $doc.find('userloved').text();
			if (userlovedStatus) {
				userloved = userlovedStatus === '1';
			}

			let artist = $doc.find('artist > name').text();
			let track = $doc.find('track > name').text();
			let album = $doc.find('album > title').text();
			let duration = (parseInt($doc.find('track > duration').text()) / 1000) || null;

			let artistThumbUrl = null;
			let imageSizes = ['extralarge', 'large', 'medium'];
			for (let imageSize of imageSizes) {
				artistThumbUrl = $doc.find(`album > image[size="${imageSize}"]`).text();
				if (artistThumbUrl) {
					break;
				}
			}

			let artistUrl = $doc.find('artist > url').text();
			let trackUrl = $doc.find('track > url').text();
			let albumUrl = $doc.find('album > url').text();

			return {
				artist, track, album, duration, userloved,
				artistThumbUrl, artistUrl, albumUrl, trackUrl
			};
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
