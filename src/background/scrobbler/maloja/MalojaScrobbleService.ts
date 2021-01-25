import { fetchJson } from '@/background/util/fetch/FetchJson';

import type { TrackInfo } from '@/background/model/song/TrackInfo';
import type { ScrobbleService } from '@/background/scrobbler/ScrobbleService';
import type { MalojaTrackMetadata } from '@/background/scrobbler/maloja/MalojaTrackMetadata';
import type { ScrobblerSession } from '@/background/account/ScrobblerSession';
import { TrackContextInfo } from '@/background/model/song/TrackContextInfo';

export class MalojaScrobbleService implements ScrobbleService {
	constructor(private session: ScrobblerSession, private apiUrl: string) {}

	getTrackContextInfo(): Promise<TrackContextInfo> {
		return null;
	}

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
		const key = this.session.getId();
		const query = { trackMetadata, key };

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
