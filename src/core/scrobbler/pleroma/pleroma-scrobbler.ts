'use strict';

import { ServiceCallResult } from '@/core/object/service-call-result';
import { BaseSong } from '@/core/object/song';
import { timeoutPromise } from '@/util/util';
import BaseScrobbler, { SessionData } from '@/core/scrobbler/base-scrobbler';
import { PleromaTrackMetadata } from '@/core/scrobbler/pleroma/pleroma.types';

/**
 * Module for communication with Pleroma
 */

export default class PleromaScrobbler extends BaseScrobbler<'Pleroma'> {
	public userToken!: string;
	public userApiUrl!: string;

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
				'Authorization': 'Bearer ' + this.userToken,
			},
		};

		const verifyCredentialsUrl = 'https://' + this.userApiUrl + '/api/v1/accounts/verify_credentials';
		const promise = fetch(verifyCredentialsUrl, requestInfo);
		const timeout = this.REQUEST_TIMEOUT;
		let response = null;
		try {
			response = await timeoutPromise(timeout, promise);
			if (response.status !== 200) {
				return ServiceCallResult.ERROR_AUTH;
			}
			return Promise.resolve({ sessionID: this.userToken, sessionName: (await response.json()).fqn });
		} catch (e) {
			this.debugLog('Error while sending request', 'error');
			return ServiceCallResult.ERROR_AUTH;
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
	public async scrobble(song: BaseSong): Promise<ServiceCallResult> {
		const songData = this.makeTrackMetadata(song);

		return this.sendRequest(songData, this.userToken);
	}

	/** Private methods */

	async()

	async sendRequest(
		params: PleromaTrackMetadata,
		userToken: string
	): Promise<ServiceCallResult> {
		const requestInfo = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + userToken,
			},
			body: JSON.stringify(params),
		};

		const scrobbleUrl = 'https://' + this.userApiUrl + '/api/v1/pleroma/scrobble';

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
			url: song.parsed.originUrl,
		};

		const album = song.getAlbum();
		if (album) {
			trackMeta.album = album;
		}

		return trackMeta;
	}
}
