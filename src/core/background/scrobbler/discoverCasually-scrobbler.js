'use strict';

/**
 * Module for communication with DiscoverCasually
 */
define((require) => {
	const Util = require('util/util');
	const BaseScrobbler = require('scrobbler/base-scrobbler');
	const ServiceCallResult = require('object/service-call-result');

	class DiscoverCasually extends BaseScrobbler {

		/** @override */
		getStorageName() {
			return 'DiscoverCasually';
		}

		/** @override */
		getId() {
			return 'DiscoverCasually';
		}

		/** @override */
		getLabel() {
			return 'DiscoverCasually';
		}

		/** @override */
		getStatusUrl() {
			return null;
		}

		/** @override */
		getUsedDefinedProperties() {
			return ['userApiUrl', 'userToken'];
		}

		/** @override */
		getProfileUrl() {
			return null;
		}

		/** @override */
		async getAuthUrl() {
			return null;
		}

		/** @override */
		async getSession() {
			if (!this.userApiUrl) {
				throw ServiceCallResult.ERROR_AUTH;
			}
			return {
				userName: 'DiscoverCasually',
				sessionID: 99999 };
		}

		/** @override */
		async isReadyForGrantAccess() {
			return false;
		}

		/** @override */
		async sendNowPlaying() {
			// DiscoverCasually does not support "now playing" scrobbles.
			// return ServiceCallResult.RESULT_OK;
		}

		/** @override */
		async scrobble(song) {
			const songData = this.makeTrackMetadata(song);
			console.log('line 70', song);
			return this.sendRequest(songData, this.userApiUrl);
		}

		/** Private methods */

		async sendRequest(params, sessionID) {
			// params.key = sessionID;

			const requestInfo = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(params),
			};
			console.log(requestInfo, 'is this going through');
			const promise = fetch(this.userApiUrl, requestInfo);
			const timeout = BaseScrobbler.REQUEST_TIMEOUT;

			let response = null;
			try {
				response = await Util.timeoutPromise(timeout, promise);
				if (response.status !== 200) {
					return ServiceCallResult.ERROR_OTHER;
				}
			} catch (e) {
				this.debugLog('Error while sending request', 'error');
				return ServiceCallResult.ERROR_OTHER;
			}

			return ServiceCallResult.RESULT_OK;
		}

		makeTrackMetadata(song) {
			const trackMeta = {
				artist: song.getArtist(),
				title: song.getTrack(),
				time: song.metadata.startTimestamp,
			};

			if (song.getAlbum()) {
				trackMeta.album = song.getAlbum();
			}

			if (song.getAlbumArtist()) {
				trackMeta.albumartists = [song.getAlbumArtist()];
			}

			return trackMeta;
		}
	}

	return DiscoverCasually;
});
