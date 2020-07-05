import ApiCallResult from '@/background/object/api-call-result';
import BaseScrobbler from '@/background/scrobbler/base-scrobbler';

import { timeoutPromise } from '@/background/util/util';

export default class ListenBrainz extends BaseScrobbler {
	/** @override */
	getStorageName() {
		return 'Maloja';
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
		if (!this.userToken) {
			throw this.makeApiCallResult(ApiCallResult.ERROR_AUTH);
		}
		return { sessionID: this.userToken };
	}

	/** @override */
	async isReadyForGrantAccess() {
		return false;
	}

	/** @override */
	async sendNowPlaying(songInfo) {
		const { sessionID } = await this.getSession();
		const songData = this.makeTrackMetadata(songInfo);
		return this.sendRequest(songData, sessionID);
	}

	/** @override */
	async scrobble(songInfo) {
		const requestData = this.makeTrackMetadata(songInfo);
		requestData.time = songInfo.timestamp;

		return this.sendRequest(requestData, this.userToken);
	}

	/** Private methods */

	async sendRequest(params, sessionID) {
		params.key = sessionID;

		const requestInfo = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(params),
		};

		const promise = fetch(this.userApiUrl, requestInfo);
		const timeout = BaseScrobbler.REQUEST_TIMEOUT;

		let response = null;
		try {
			response = await timeoutPromise(timeout, promise);
			if (response.status !== 200) {
				this.makeApiCallResult(ApiCallResult.ERROR_OTHER);
			}
		} catch (e) {
			this.debugLog('Error while sending request', 'error');
			throw this.makeApiCallResult(ApiCallResult.ERROR_OTHER);
		}

		return this.makeApiCallResult(ApiCallResult.RESULT_OK);
	}

	makeTrackMetadata(songInfo) {
		const { artist, track } = songInfo;
		return { artist, track };
	}
}
