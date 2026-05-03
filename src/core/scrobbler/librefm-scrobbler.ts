'use strict';

import { createQueryString } from '@/util/util-browser';
import type { AudioScrobblerParams } from '@/core/scrobbler/audio-scrobbler/audio-scrobbler';
import AudioScrobbler from '@/core/scrobbler/audio-scrobbler/audio-scrobbler';

/**
 * Module for all communication with libre.fm
 */

export default class LibreFmScrobbler extends AudioScrobbler {
	/** @override */
	getApiUrl(): string {
		return 'https://libre.fm/2.0/';
	}

	/** @override */
	getApiKey(): string {
		return 'r8i1y91hz71tcx7vyrp9hk1alhqp1898';
	}

	/** @override */
	getApiSecret(): string {
		return '8187db5vg234yq6tm7o62q8mtl1niala';
	}

	/** @override */
	getBaseAuthUrl(): string {
		return 'https://www.libre.fm/api/auth/';
	}

	/** @override */
	getBaseProfileUrl(): string {
		return 'https://libre.fm/user/';
	}

	/** @override */
	getLabel(): 'Libre.fm' {
		return 'Libre.fm';
	}

	/** @override */
	getStatusUrl(): string {
		return '';
	}

	/** @override */
	getStorageName(): 'LibreFM' {
		return 'LibreFM';
	}

	public async getSongInfo(): Promise<Record<string, never>> {
		return Promise.resolve({});
	}

	/** @override */
	protected sendRequest<
		T extends Record<string, unknown> = Record<string, unknown>,
	>(
		options: RequestInit,
		params: AudioScrobblerParams,
		signed?: boolean,
	): Promise<T> {
		if ('post' === options.method?.toLowerCase()) {
			options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
			};
			options.body = createQueryString(params);
		}

		return super.sendRequest(options, params, signed);
	}
}
