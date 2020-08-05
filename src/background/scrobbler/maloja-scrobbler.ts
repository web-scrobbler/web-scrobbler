import { ApiCallResult } from '@/background/scrobbler/api-call-result';
import { BaseScrobbler, Session } from '@/background/scrobbler/base-scrobbler';

import { SongInfo } from '@/background/object/song';

import { timeoutPromise } from '@/background/util/util';

export class MalojaScrobbler extends BaseScrobbler {
	private userToken: string;
	private userApiUrl: string;

	/** @override */
	getStorageName(): string {
		return 'Maloja';
	}

	/** @override */
	getId(): string {
		return 'maloja';
	}

	/** @override */
	getLabel(): string {
		return 'Maloja';
	}

	/** @override */
	getStatusUrl(): string {
		return null;
	}

	/** @override */
	getUsedDefinedProperties(): string[] {
		return ['userApiUrl', 'userToken'];
	}

	/** @override */
	getBaseProfileUrl(): string {
		return null;
	}

	/** @override */
	async getAuthUrl(): Promise<string> {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return Promise.resolve(null);
	}

	/** @override */
	async getSession(): Promise<Session> {
		if (!this.userToken) {
			throw this.makeApiCallResult(ApiCallResult.ERROR_AUTH);
		}
		return Promise.resolve({ sessionID: this.userToken, sessionName: null });
	}

	/** @override */
	async isReadyForGrantAccess(): Promise<boolean> {
		return Promise.resolve(false);
	}

	/** @override */
	async sendNowPlaying(songInfo: SongInfo): Promise<ApiCallResult> {
		const { sessionID } = await this.getSession();
		const songData = this.makeTrackMetadata(songInfo);
		return this.sendRequest(songData, sessionID);
	}

	/** @override */
	async scrobble(songInfo: SongInfo): Promise<ApiCallResult> {
		const requestData = this.makeTrackMetadata(songInfo);
		// @ts-ignore
		requestData.time = songInfo.timestamp;

		return this.sendRequest(requestData, this.userToken);
	}

	/** @override */
	async toggleLove(/* songInfo: SongInfo */): Promise<ApiCallResult> {
		return Promise.resolve(
			this.makeApiCallResult(ApiCallResult.ERROR_OTHER)
		);
	}

	private async sendRequest(
		params,
		sessionID: string
	): Promise<ApiCallResult> {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (response.status !== 200) {
				this.makeApiCallResult(ApiCallResult.ERROR_OTHER);
			}
		} catch (e) {
			this.debugLog('Error while sending request', 'error');
			throw this.makeApiCallResult(ApiCallResult.ERROR_OTHER);
		}

		return this.makeApiCallResult(ApiCallResult.RESULT_OK);
	}

	private makeTrackMetadata(songInfo: SongInfo) {
		const { artist, track } = songInfo;
		return { artist, track };
	}
}
