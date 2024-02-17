'use strict';

import { ServiceCallResult } from '@/core/object/service-call-result';
import { BaseSong } from '@/core/object/song';
import { timeoutPromise } from '@/util/util';
import BaseScrobbler, { SessionData } from '@/core/scrobbler/base-scrobbler';
import {
	PleromaTrackMetadata,
	PleromaUser,
} from '@/core/scrobbler/pleroma/pleroma.types';

/**
 * Module for communication with Pleroma
 */

export default class PleromaScrobbler extends BaseScrobbler<'Pleroma'> {
	public userToken!: string;
	public userApiUrl!: string;
	public isLocalOnly = true;

	/** @override */
	protected getStorageName(): 'Pleroma' {
		return 'Pleroma';
	}

	/** @override */
	public getLabel(): 'Pleroma' {
		return 'Pleroma';
	}

	/** @override */
	public getStatusUrl(): string {
		return '';
	}

	/** @override */
	public getUserDefinedProperties(): string[] {
		return ['userApiUrl', 'userToken'];
	}

	/** @override */
	public async getProfileUrl(): Promise<string> {
		return Promise.resolve('');
	}

	/** @override */
	public async getAuthUrl(): Promise<string> {
		return Promise.resolve('');
	}
	/** @override */
	protected getBaseProfileUrl(): string {
		return '';
	}

	/** @override */
	public getSongInfo(): Promise<Record<string, never>> {
		return Promise.resolve({});
	}

	public toggleLove(): Promise<ServiceCallResult> {
		return Promise.resolve(ServiceCallResult.ERROR_OTHER);
	}

	/** @override */
	public async getSession(): Promise<SessionData> {
		if (!this.userToken) {
			throw ServiceCallResult.ERROR_AUTH;
		}

		const requestInfo = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.userToken}`,
			},
		};

		const verifyCredentialsUrl = `https://${this.userApiUrl}/api/v1/accounts/verify_credentials`;
		const promise = fetch(verifyCredentialsUrl, requestInfo);
		const timeout = this.REQUEST_TIMEOUT;
		let response = null;
		try {
			response = await timeoutPromise(timeout, promise);
			if (response.status !== 200) {
				throw ServiceCallResult.ERROR_AUTH;
			}

			const json = (await response.json()) as PleromaUser | null;
			const fqn = json ? json.fqn : '';
			return { sessionID: this.userToken, sessionName: fqn };
		} catch (e) {
			this.debugLog('Error while sending request', 'error');
			throw ServiceCallResult.ERROR_AUTH;
		}
	}

	/** @override */
	public isReadyForGrantAccess(): Promise<boolean> {
		return Promise.resolve(false);
	}

	/** @override */
	public sendNowPlaying(): Promise<ServiceCallResult> {
		// Pleroma does not support "now playing" scrobbles.
		return Promise.resolve(ServiceCallResult.RESULT_OK);
	}

	/** @override */
	async sendResumedPlaying(): Promise<ServiceCallResult> {
		return Promise.resolve(ServiceCallResult.RESULT_OK);
	}

	/** @override */
	async sendPaused(): Promise<ServiceCallResult> {
		return Promise.resolve(ServiceCallResult.RESULT_OK);
	}

	/** @override */
	public async scrobble(songs: BaseSong[]): Promise<ServiceCallResult[]> {
		const resultArray: Promise<ServiceCallResult>[] = [];
		for (const song of songs.slice(0, 50)) {
			const songData = this.makeTrackMetadata(song);
			resultArray.push(this.sendRequest(songData, this.userToken));
		}
		return Promise.all(resultArray);
	}

	/** Private methods */

	async sendRequest(
		params: PleromaTrackMetadata,
		userToken: string,
	): Promise<ServiceCallResult> {
		const requestInfo = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userToken}`,
			},
			body: JSON.stringify(params),
		};

		const scrobbleUrl = `https://${this.userApiUrl}/api/v1/pleroma/scrobble`;

		const promise = fetch(scrobbleUrl, requestInfo);

		const timeout = this.REQUEST_TIMEOUT;

		let response = null;
		try {
			response = await timeoutPromise(timeout, promise);
			if (response.status !== 200) {
				return ServiceCallResult.ERROR_OTHER;
			}
		} catch (e) {
			this.debugLog('Error while sending request', 'error');
			return ServiceCallResult.ERROR_OTHER;
		}

		return ServiceCallResult.RESULT_OK;
	}

	private makeTrackMetadata(song: BaseSong) {
		const trackMeta: PleromaTrackMetadata = {
			artist: song.getArtist() ?? '',
			title: song.getTrack() ?? '',
			length: song.getDuration(),
			url: song.parsed.originUrl ?? '',
		};

		const album = song.getAlbum();
		if (album) {
			trackMeta.album = album;
		}

		return trackMeta;
	}
}
