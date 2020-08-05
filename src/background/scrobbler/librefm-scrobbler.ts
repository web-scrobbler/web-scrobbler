import {
	AudioScrobbler,
	AudioScrobblerResponse,
	AudioScrobblerApiParams,
} from '@/background/scrobbler/audio-scrobbler';

import { createQueryString } from '@/common/util-browser';

export class LibreFmScrobbler extends AudioScrobbler {
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
	getId(): string {
		return 'librefm';
	}

	/** @override */
	getLabel(): string {
		return 'Libre.fm';
	}

	/** @override */
	getStatusUrl(): string {
		return null;
	}

	/** @override */
	getStorageName(): string {
		return 'LibreFM';
	}

	/** @override */
	async sendRequest(
		options: RequestInit,
		params: AudioScrobblerApiParams,
		{ signed = true } = {}
	): Promise<AudioScrobblerResponse> {
		if ('post' === options.method.toLowerCase()) {
			options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
			};
			options.body = createQueryString(params);
		}

		return super.sendRequest(options, params, { signed });
	}
}
