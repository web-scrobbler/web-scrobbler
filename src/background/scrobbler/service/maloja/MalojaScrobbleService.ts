import { fetchJson } from '@/background/util/fetch/FetchJson';

import type { FetchResponse } from '@/background/util/fetch/Fetch';
import type { Session } from '@/background/account/Session';
import type { TrackInfo } from '@/background/model/song/TrackInfo';
import type { ScrobbleService } from '@/background/scrobbler/service/ScrobbleService';
import type { MalojaTrackMetadata } from '@/background/scrobbler/service/maloja/MalojaTrackMetadata';

export class MalojaScrobbleService implements ScrobbleService {
	constructor(private session: Session, private apiUrl: string) {}

	sendNowPlayingRequest(trackInfo: TrackInfo): Promise<void> {
		const trackMetadata = this.makeTrackMetadata(trackInfo);
		return this.sendRequest(trackMetadata);
	}

	sendScrobbleRequest(trackInfo: TrackInfo): Promise<void> {
		const requestData = this.makeTrackMetadata(trackInfo);
		requestData.time = trackInfo.timestamp;

		return this.sendRequest(requestData);
	}

	sendLoveRequest(): Promise<void> {
		return Promise.resolve();
	}

	private async sendRequest(
		trackMetadata: MalojaTrackMetadata
	): Promise<void> {
		const query = { trackMetadata, key: this.session.sessionId };

		const requestInfo = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(query),
		};

		const { status } = await fetchJson(this.apiUrl, requestInfo);
		if (status !== 200) {
			// TODO Add debug

			throw new Error(`Received error status code: ${status}`);
		}
	}

	private makeTrackMetadata(songInfo: TrackInfo): MalojaTrackMetadata {
		const { artist, track } = songInfo;
		return { artist, track };
	}
}
