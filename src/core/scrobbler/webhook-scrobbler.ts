'use strict';

import { BaseSong } from '@/core/object/song';
import BaseScrobbler from '@/core/scrobbler/base-scrobbler';
import { SessionData } from './base-scrobbler';
import { timeoutPromise } from '@/util/util';
import { ServiceCallResult } from '../object/service-call-result';
import ClonedSong from '../object/cloned-song';

type WebhookRequest = {
	eventName: string;
	data: {
		song: BaseSong;
		isLoved?: boolean;
	};
};

/**
 * Module for all communication with a custom webhook
 */

export default class WebhookScrobbler extends BaseScrobbler<'Webhook'> {
	public userApiUrl!: string;

	/** @override */
	getApiUrl(): string {
		return '';
	}

	/** @override */
	getApiKey(): string {
		return '';
	}

	/** @override */
	getApiSecret(): string {
		return '';
	}

	/** @override */
	getBaseAuthUrl(): string {
		return '';
	}

	/** @override */
	getBaseProfileUrl(): string {
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
		// Webhook connection doesn't have a session.
		return Promise.resolve({ sessionID: 'webhook' });
	}

	/** @override */
	public getAuthUrl(): Promise<string> {
		throw new Error('Method not implemented.');
	}

	/** @override */
	public isReadyForGrantAccess(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}

	/** @override */
	public getUsedDefinedProperties(): string[] {
		return ['userApiUrl'];
	}

	public async getSongInfo(): Promise<Record<string, never>> {
		return Promise.resolve({});
	}

	/** @override */
	async sendRequest(request: WebhookRequest): Promise<ServiceCallResult> {
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

	/** @override */
	async sendNowPlaying(song: BaseSong): Promise<ServiceCallResult> {
		return this.sendRequest({
			eventName: 'nowplaying',
			data: { song },
		});
	}

	/** @override */
	async sendPaused(song: BaseSong): Promise<ServiceCallResult> {
		return this.sendRequest({
			eventName: 'paused',
			data: { song },
		});
	}

	/** @override */
	async sendResumedPlaying(song: BaseSong): Promise<ServiceCallResult> {
		return this.sendRequest({
			eventName: 'resumedplaying',
			data: { song },
		});
	}

	/** @override */
	public async scrobble(song: BaseSong): Promise<ServiceCallResult> {
		return this.sendRequest({
			eventName: 'scrobble',
			data: { song },
		});
	}

	/** @override */
	public toggleLove(
		song: ClonedSong,
		isLoved: boolean,
	): Promise<ServiceCallResult | Record<string, never>> {
		return this.sendRequest({
			eventName: 'loved',
			data: { song, isLoved },
		});
	}
}
