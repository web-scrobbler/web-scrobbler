/* eslint-disable camelcase */

import Logger, { ILogger } from 'js-logger';

import { fetchJson } from '@/background/util/fetch/FetchJson';

import type { ScrobbleService } from '@/background/scrobbler/ScrobbleService';
import type { ScrobblerSession } from '@/background/scrobbler/ScrobblerSession';
import { TrackContextInfo } from '@/background/scrobbler/TrackContextInfo';
import { ScrobbleEntity } from '@/background/scrobbler/ScrobbleEntity';

interface ListenBrainzParams {
	listen_type: 'playing_now' | 'single';
	payload: unknown[];
}

interface TrackMetadata {
	artist_name: string;
	track_name: string;
	release_name?: string;
	additional_info: {
		origin_url?: string;
		release_artist_name?: string;
	};
}

export const defaultApiUrl = 'https://api.listenbrainz.org/1/submit-listens';

export class ListenBrainzScrobblerService implements ScrobbleService {
	private logger: ILogger = Logger.get('ListenBrainz');

	constructor(private session: ScrobblerSession, private apiUrl: string) {}

	getTrackContextInfo(): Promise<TrackContextInfo> {
		return null;
	}

	getAuthUrl(): string {
		return 'https://listenbrainz.org/login/musicbrainz?next=%2Fprofile%2F';
	}

	sendNowPlayingRequest(scrobbleEntity: ScrobbleEntity): Promise<void> {
		const trackMeta = this.makeTrackMetadata(scrobbleEntity);

		const params: ListenBrainzParams = {
			listen_type: 'playing_now',
			payload: [
				{
					track_metadata: trackMeta,
				},
			],
		};

		return this.sendRequest(params);
	}

	sendScrobbleRequest(scrobbleEntity: ScrobbleEntity): Promise<void> {
		const params: ListenBrainzParams = {
			listen_type: 'single',
			payload: [
				{
					listened_at: scrobbleEntity.getTimestamp().toString(),
					track_metadata: this.makeTrackMetadata(scrobbleEntity),
				},
			],
		};

		return this.sendRequest(params);
	}

	sendLoveRequest(): Promise<void> {
		return Promise.resolve();
	}

	private async sendRequest(params: ListenBrainzParams): Promise<void> {
		const requestInfo = {
			method: 'POST',
			headers: {
				Authorization: `Token ${this.session.getId()}`,
				'Content-Type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify(params),
		};

		const { ok, data } = await fetchJson(this.apiUrl, requestInfo);
		this.logger.info('Response', JSON.stringify(data, null, 2));

		if (!ok) {
			throw new Error('Received error response');
		}
	}

	private makeTrackMetadata(scrobbleEntity: ScrobbleEntity): TrackMetadata {
		const trackMeta: TrackMetadata = {
			artist_name: scrobbleEntity.getArtist(),
			track_name: scrobbleEntity.getTrack(),
			additional_info: {},
		};

		if (scrobbleEntity.getAlbum()) {
			trackMeta.release_name = scrobbleEntity.getAlbum();
		}

		if (scrobbleEntity.getOriginUrl()) {
			trackMeta.additional_info.origin_url = scrobbleEntity.getOriginUrl();
		}

		if (scrobbleEntity.getAlbumArtist()) {
			trackMeta.additional_info.release_artist_name = scrobbleEntity.getAlbumArtist();
		}

		return trackMeta;
	}
}
