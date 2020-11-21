/* eslint-disable camelcase */

import { ApiCallResult } from '@/background/scrobbler/api-call-result';
import { BaseScrobbler, Session } from '@/background/scrobbler/base-scrobbler';

import { SongInfo } from '@/background/object/song';
import { hideObjectValue, timeoutPromise } from '@/background/util/util';

const listenBrainzTokenPage = 'https://listenbrainz.org/profile/';
const apiUrl = 'https://api.listenbrainz.org/1/submit-listens';

interface ListenBrainzStorage {
	sessionID: string;
	sessionName: string;
	isAuthStarted: boolean;
}

interface ListenBrainzResult {
	status: string;
}

interface ListenBrainzParams {
	listen_type: 'playing_now' | 'single';
	payload: unknown[];
}

export class ListenBrainzScrobbler extends BaseScrobbler {
	userToken: string;
	userApiUrl: string;

	/** @override */
	async getAuthUrl(): Promise<string> {
		const data = (await this.storage.get()) as ListenBrainzStorage;

		data.isAuthStarted = true;
		delete data.sessionID;
		delete data.sessionName;
		await this.storage.set(data);

		return 'https://listenbrainz.org/login/musicbrainz?next=%2Fprofile%2F';
	}

	/** @override */
	getBaseProfileUrl(): string {
		return 'https://listenbrainz.org/user/';
	}

	/** @override */
	getId(): string {
		return 'listenbrainz';
	}

	/** @override */
	getLabel(): string {
		return 'ListenBrainz';
	}

	/** @override */
	async getProfileUrl(): Promise<string> {
		if (this.userToken) {
			return null;
		}
		return super.getProfileUrl();
	}

	/** @override */
	getStatusUrl(): string {
		if (this.userToken) {
			return null;
		}

		return 'https://listenbrainz.org/current-status';
	}

	/** @override */
	getStorageName(): string {
		return 'ListenBrainz';
	}

	/** @override */
	getUsedDefinedProperties(): string[] {
		return ['userApiUrl', 'userToken'];
	}

	/** @override */
	async signOut(): Promise<void> {
		if (this.userApiUrl || this.userToken) {
			await this.applyUserProperties({
				userApiUrl: null,
				userToken: null,
			});
		}
		await super.signOut();
	}

	/** @override */
	async getSession(): Promise<Session> {
		if (this.userToken) {
			return { sessionID: this.userToken, sessionName: null };
		}

		const data = (await this.storage.get()) as ListenBrainzStorage;
		if (data.isAuthStarted) {
			let session = this.createEmptySession();

			try {
				session = await this.requestSession();
			} catch (err) {
				this.debugLog('Failed to get session', 'warn');

				await this.signOut();
				throw err;
			}

			data.sessionID = session.sessionID;
			data.sessionName = session.sessionName;
			delete data.isAuthStarted;
			await this.storage.set(data);

			return session;
		} else if (!data.sessionID) {
			throw this.makeApiCallResult(ApiCallResult.ERROR_AUTH);
		}

		return {
			sessionID: data.sessionID,
			sessionName: data.sessionName,
		};
	}

	/** @override */
	async isReadyForGrantAccess(): Promise<boolean> {
		if (this.userToken) {
			return false;
		}

		const data = (await this.storage.get()) as ListenBrainzStorage;
		return data.isAuthStarted;
	}

	/** @override */
	async sendNowPlaying(songInfo: SongInfo): Promise<ApiCallResult> {
		const { sessionID } = await this.getSession();
		const trackMeta = this.makeTrackMetadata(songInfo);

		const params: ListenBrainzParams = {
			listen_type: 'playing_now',
			payload: [
				{
					track_metadata: trackMeta,
				},
			],
		};
		return this.sendRequest(params, sessionID);
	}

	/** @override */
	async scrobble(songInfo: SongInfo): Promise<ApiCallResult> {
		const { sessionID } = await this.getSession();

		const params: ListenBrainzParams = {
			listen_type: 'single',
			payload: [
				{
					listened_at: songInfo.timestamp.toString(),
					track_metadata: this.makeTrackMetadata(songInfo),
				},
			],
		};
		return this.sendRequest(params, sessionID);
	}

	/** @override */
	async toggleLove(/* songInfo: SongInfo */): Promise<ApiCallResult> {
		return Promise.resolve(
			this.makeApiCallResult(ApiCallResult.ERROR_OTHER)
		);
	}

	private async sendRequest(
		params: ListenBrainzParams,
		sessionID: string
	): Promise<ApiCallResult> {
		const requestInfo = {
			method: 'POST',
			headers: {
				Authorization: `Token ${sessionID}`,
				'Content-Type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify(params),
		};
		const promise = fetch(this.userApiUrl || apiUrl, requestInfo);
		const timeout = BaseScrobbler.REQUEST_TIMEOUT;

		let result: ListenBrainzResult = null;
		let response: Response = null;

		try {
			response = await timeoutPromise(timeout, promise);
			result = (await response.json()) as ListenBrainzResult;
		} catch {
			this.debugLog('Error while sending request', 'error');
			throw this.makeApiCallResult(ApiCallResult.ERROR_OTHER);
		}

		switch (response.status) {
			case 400:
				this.debugLog('Invalid JSON sent', 'error');
				throw this.makeApiCallResult(ApiCallResult.ERROR_AUTH);
			case 401:
				this.debugLog('Invalid Authorization sent', 'error');
				throw this.makeApiCallResult(ApiCallResult.ERROR_AUTH);
		}

		this.debugLog(JSON.stringify(result, null, 2));

		return this.processResult(result);
	}

	async requestSession(): Promise<Session> {
		const authUrls = [listenBrainzTokenPage, await this.getAuthUrl()];

		let session = this.createEmptySession();

		for (const url of authUrls) {
			try {
				session = await this.fetchSession(url);
			} catch {
				this.debugLog('request session timeout', 'warn');
				continue;
			}

			if (session) {
				break;
			}
		}

		if (session) {
			const safeId = hideObjectValue(session.sessionID);
			this.debugLog(`Session ID: ${safeId}`);

			return session;
		}

		throw this.makeApiCallResult(ApiCallResult.ERROR_AUTH);
	}

	async fetchSession(url: string): Promise<Session> {
		this.debugLog(`Use ${url}`);
		// NOTE: Use 'same-origin' credentials to fix login on Firefox ESR 60.
		const promise = fetch(url, {
			method: 'GET',
			credentials: 'same-origin',
		});
		const timeout = BaseScrobbler.REQUEST_TIMEOUT;

		const response = await timeoutPromise(timeout, promise);
		if (response.ok) {
			const parser = new DOMParser();

			const rawHtml = await response.text();
			const doc = parser.parseFromString(rawHtml, 'text/html');

			const sessionNameEl = doc.querySelector('.page-title');
			const sessionIdEl = doc.querySelector('#auth-token');

			const sessionName = sessionNameEl && sessionNameEl.textContent;
			const sessionID = sessionIdEl && sessionIdEl.getAttribute('value');

			if (sessionID && sessionName) {
				return { sessionID, sessionName };
			}
		}

		return null;
	}

	processResult(result: ListenBrainzResult): ApiCallResult {
		if (result.status !== 'ok') {
			throw this.makeApiCallResult(ApiCallResult.ERROR_OTHER);
		}

		return this.makeApiCallResult(ApiCallResult.RESULT_OK);
	}

	makeTrackMetadata(songInfo: SongInfo): TrackMetadata {
		const { artist, track, album, albumArtist, originUrl } = songInfo;

		const trackMeta: TrackMetadata = {
			artist_name: artist,
			track_name: track,
			additional_info: {},
		};

		if (album) {
			trackMeta.release_name = album;
		}

		if (originUrl) {
			trackMeta.additional_info.origin_url = originUrl;
		}

		if (albumArtist) {
			trackMeta.additional_info.release_artist_name = albumArtist;
		}

		return trackMeta;
	}
}

interface TrackMetadata {
	artist_name: string;
	track_name: string;
	release_name?: string;
	additional_info: {
		origin_url?: string;
		release_artist_name?: string;
	};
}
