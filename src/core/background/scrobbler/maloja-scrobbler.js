'use script';

define((require) => {
	const Util = require('util/util');
	const BaseScrobbler = require('scrobbler/base-scrobbler');
	const ServiceCallResult = require('object/service-call-result');

	class Maloja extends BaseScrobbler {

		/** @override */
		getStorageName() {
			return 'Maloja'
		}

		/** @override */
		getId() {
			return 'maloja';
		}

		/** @override */
		getLabel() {
			return 'Maloja';
		}

		/** @override */
		getStatusUrl() {
			return null
		}

		/** @override */
		getUsedDefinedProperties() {
			return ['userApiUrl', 'userToken']
		}

		/** @override */
		getProfileUrl() {
			return null
		}

		/** @override */
		async getAuthUrl() {
			return null
		}

		/** @override */
		async getSession() {
			return { sessionID: this.userToken };
		}

		/** @override */
		async isReadyForGrantAccess() {
			return false
		}

		/** @override */
		async sendNowPlaying(song) {
			const { sessionID } = await this.getSession();
			const songData = this.makeTrackMetadata(song);
			return this.sendRequest(songData, sessionID);
		}

		/** @override */
		async scrobble(song) {
			const { sessionID } = await this.getSession();

			const songData = this.makeTrackMetadata(song);
			const params = {
				time: song.metadata.startTimestamp,
				...songData
			}

			return this.sendRequest(params, sessionID);
		}

		/** Private methods */
		async sendRequest(params, sessionID) {

			const apiInfo = {
				key: sessionID
			}

			const requestInfo = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({...apiInfo, ...params})
			}

			const promise = fetch(this.userApiUrl, requestInfo);
			const timeout = BaseScrobbler.REQUEST_TIMEOUT;

			let result = null;
			let response = null;
			try {
				response = await Util.timeoutPromise(timeout, promise);
				result = await response.json();
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
			}

			return trackMeta;
		}
	}

	return Maloja;
})
