'use strict';

import { ServiceCallResult } from '@/core/object/service-call-result';
import type { BaseSong } from '@/core/object/song';
import { timeoutPromise } from '@/util/util';
import type { SessionData } from '@/core/scrobbler/base-scrobbler';
import BaseScrobbler from '@/core/scrobbler/base-scrobbler';
import type { MalojaTrackMetadata } from '@/core/scrobbler/maloja/maloja.types';

/**
 * Module for communication with Maloja
 */

export default class MalojaScrobbler extends BaseScrobbler<'Maloja'> {
	public userToken!: string;
	public userApiUrl!: string;
	public isLocalOnly = true;

	/** @override */
	protected getStorageName(): 'Maloja' {
		return 'Maloja';
	}

	/** @override */
	public getLabel(): 'Maloja' {
		return 'Maloja';
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
			throw new Error(ServiceCallResult.ERROR_AUTH);
		}
		return Promise.resolve({ sessionID: this.userToken });
	}

	/** @override */
	public isReadyForGrantAccess(): Promise<boolean> {
		return Promise.resolve(false);
	}

	/** @override */
	public sendNowPlaying(): Promise<ServiceCallResult> {
		// Maloja does not support "now playing" scrobbles.
		return Promise.resolve(ServiceCallResult.RESULT_OK);
	}

	/** @override */
	async sendPaused(): Promise<ServiceCallResult> {
		return Promise.resolve(ServiceCallResult.RESULT_OK);
	}

	/** @override */
	async sendResumedPlaying(): Promise<ServiceCallResult> {
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
		params: MalojaTrackMetadata,
		sessionID: string,
	): Promise<ServiceCallResult> {
		params.key = sessionID;

		const requestInfo = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(params),
		};

		const promise = fetch(this.userApiUrl, requestInfo);

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
		const trackMeta: MalojaTrackMetadata = {
			artist: song.getArtist() ?? '',
			title: song.getTrack() ?? '',
			time: song.metadata.startTimestamp,
		};

		const album = song.getAlbum();
		if (album) {
			trackMeta.album = album;
		}

		const albumArtist = song.getAlbumArtist();
		if (albumArtist) {
			trackMeta.albumartists = [albumArtist];
		}

		return trackMeta;
	}
}
