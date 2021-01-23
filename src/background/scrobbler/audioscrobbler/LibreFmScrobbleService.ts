import { AudioScrobblerScrobbleService } from '@/background/scrobbler/audioscrobbler/AudioScrobblerScrobbleService';

import type { AudioScrobblerApiParams } from '@/background/scrobbler/audioscrobbler/AudioScrobblerApiParams';
import type { AudioScrobblerResponse } from '@/background/scrobbler/audioscrobbler/AudioScrobblerResponse';

import { createQueryString } from '@/common/util-browser';

export class LibreFmScrobbleService extends AudioScrobblerScrobbleService {
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
