'use strict';

import { BaseSong } from '@/core/object/song';
import BaseScrobbler from '@/core/scrobbler/base-scrobbler';
import { SessionData } from './base-scrobbler';
import { timeoutPromise } from '@/util/util';
import { ServiceCallResult } from '../object/service-call-result';
import ClonedSong from '../object/cloned-song';

type WebhookRequest = {
	eventName: string;
	time: number;
	data: {
		song: BaseSong;
		songs?: BaseSong[];
		isLoved?: boolean;
		currentlyPlaying?: boolean;
	};
};

/**
 * Module for all communication with a custom webhook
 */

export default class WebhookScrobbler extends BaseScrobbler<'Webhook'> {
	public userApiUrl!: string;
	public isLocalOnly = true;

	/** @override */
	protected getBaseProfileUrl(): string {
		return '';
	}

	/** @override */
	getLabel(): 'Webhook' {
		return 'Webhook';
	}

	/** @override */
	getStatusUrl(): string {
		return '';
	}

	/** @override */
	getStorageName(): 'Webhook' {
		return 'Webhook';
	}

	/** @override */
	getSession(): Promise<SessionData> {
		if (!this.arrayProperties || this.arrayProperties.length === 0) {
			return Promise.reject('');
		}
		// Webhook connection doesn't have a session.
		return Promise.resolve({ sessionID: 'webhook' });
	}

	/** @override */
	public getAuthUrl(): Promise<string> {
		return Promise.resolve('');
	}

	/** @override */
	public isReadyForGrantAccess(): Promise<boolean> {
		return Promise.resolve(false);
	}

	/** @override */
	public async getProfileUrl(): Promise<string> {
		return Promise.resolve('');
	}

	/** @override */
	public getUserDefinedArrayProperties(): string[] {
		return ['applicationName', 'userApiUrl'];
	}

	public async getSongInfo(): Promise<Record<string, never>> {
		return Promise.resolve({});
	}

	/** @override */
	async sendRequest(request: WebhookRequest): Promise<ServiceCallResult> {
		if (!this.arrayProperties || this.arrayProperties.length === 0) {
			return ServiceCallResult.ERROR_AUTH;
		}
		this.debugLog(
			`Webhook - sendRequest: ${JSON.stringify(request, null, 2)}`,
		);
		const requestInfo = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(request),
		};

		const promises: Promise<Response>[] = [];
		for (const props of this.arrayProperties) {
			promises.push(fetch(props.userApiUrl, requestInfo));
		}
		const timeout = this.REQUEST_TIMEOUT;

		try {
			const responses = await timeoutPromise(
				timeout,
				Promise.all(promises),
			);
			for (const response of responses) {
				if (response.status !== 200) {
					this.debugLog(`Error in ${response.url}.`, 'error');
					return ServiceCallResult.ERROR_OTHER;
				}
			}
		} catch (e) {
			this.debugLog('Error while sending request', 'error');
			return ServiceCallResult.ERROR_OTHER;
		}

		return ServiceCallResult.RESULT_OK;
	}

	/** @override */
	async sendNowPlaying(song: BaseSong): Promise<ServiceCallResult> {
		return this.sendRequest({
			eventName: 'nowplaying',
			time: Date.now(),
			data: { song },
		});
	}

	/** @override */
	async sendPaused(song: BaseSong): Promise<ServiceCallResult> {
		return this.sendRequest({
			eventName: 'paused',
			time: Date.now(),
			data: { song },
		});
	}

	/** @override */
	async sendResumedPlaying(song: BaseSong): Promise<ServiceCallResult> {
		return this.sendRequest({
			eventName: 'resumedplaying',
			time: Date.now(),
			data: { song },
		});
	}

	/** @override */
	public async scrobble(
		songs: BaseSong[],
		currentlyPlaying: boolean,
	): Promise<ServiceCallResult[]> {
		const res = await this.sendRequest({
			eventName: 'scrobble',
			time: Date.now(),
			// send the first song as a separate argument to avoid breaking older implementations
			data: {
				song: songs[0],
				songs,
				currentlyPlaying,
			},
		});
		return new Array<ServiceCallResult>(songs.length).fill(res);
	}

	/** @override */
	public toggleLove(
		song: ClonedSong,
		isLoved: boolean,
	): Promise<ServiceCallResult | Record<string, never>> {
		return this.sendRequest({
			eventName: 'loved',
			time: Date.now(),
			data: { song, isLoved },
		});
	}
}
