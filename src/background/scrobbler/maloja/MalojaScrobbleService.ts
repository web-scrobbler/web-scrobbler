import { fetchJson } from '@/background/util/fetch/FetchJson';

import type { ScrobbleService } from '@/background/scrobbler/ScrobbleService';
import type { MalojaTrackMetadata } from '@/background/scrobbler/maloja/MalojaTrackMetadata';
import type { ScrobblerSession } from '@/background/scrobbler/ScrobblerSession';
import { TrackContextInfo } from '@/background/scrobbler/TrackContextInfo';
import { ScrobbleEntity } from '@/background/scrobbler/ScrobbleEntity';

export class MalojaScrobbleService implements ScrobbleService {
	constructor(private session: ScrobblerSession, private apiUrl: string) {}

	getTrackContextInfo(): Promise<TrackContextInfo> {
		return null;
	}

	sendNowPlayingRequest(scrobbleEntity: ScrobbleEntity): Promise<void> {
		const trackMetadata = this.makeTrackMetadata(scrobbleEntity);
		return this.sendRequest(trackMetadata);
	}

	sendScrobbleRequest(scrobbleEntity: ScrobbleEntity): Promise<void> {
		const requestData = this.makeTrackMetadata(scrobbleEntity);
		requestData.time = scrobbleEntity.getTimestamp();

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

	private makeTrackMetadata(
		scrobbleEntity: ScrobbleEntity
	): MalojaTrackMetadata {
		return {
			artist: scrobbleEntity.getArtist(),
			track: scrobbleEntity.getTrack(),
		};
	}
}
