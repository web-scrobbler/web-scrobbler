import { AudioScrobblerApiParams } from '@/background/scrobbler/service/audioscrobbler/AudioScrobblerApiParams';
import { AudioScrobblerResponse } from '@/background/scrobbler/service/audioscrobbler/AudioScrobblerResponse';
import { AudioScrobblerScrobbleService } from '@/background/scrobbler/service/audioscrobbler/AudioScrobblerScrobbleService';

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
