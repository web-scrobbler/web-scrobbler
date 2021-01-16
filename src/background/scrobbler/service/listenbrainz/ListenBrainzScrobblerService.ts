/* eslint-disable camelcase */

import { fetchJson } from '@/background/util/fetch/FetchJson';

import type { ScrobbleService } from '@/background/scrobbler/service/ScrobbleService';
import type { Session } from '@/background/account/Session';
import type { SessionData } from '@/background/scrobbler/service/TokenBasedSessionProvider';
import type { TrackInfo } from '@/background/model/song/TrackInfo';
import type { WebSessionProvider } from '@/background/scrobbler/service/WebSessionProvider';

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

export class ListenBrainzScrobblerService
	implements ScrobbleService, WebSessionProvider {
	constructor(private session: Session, private apiUrl: string) {}

	getAuthUrl(): string {
		return 'https://listenbrainz.org/login/musicbrainz?next=%2Fprofile%2F';
	}

	requestSession(): Promise<SessionData> {
		throw new Error('Method not implemented.');
	}

	sendNowPlayingRequest(trackInfo: TrackInfo): Promise<void> {
		const trackMeta = this.makeTrackMetadata(trackInfo);

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

	sendScrobbleRequest(trackInfo: TrackInfo): Promise<void> {
		const params: ListenBrainzParams = {
			listen_type: 'single',
			payload: [
				{
					listened_at: trackInfo.timestamp.toString(),
					track_metadata: this.makeTrackMetadata(songInfo),
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
				Authorization: `Token ${this.session.sessionId}`,
				'Content-Type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify(params),
		};

		const { ok } = await fetchJson(this.apiUrl, requestInfo);

		if (!ok) {
			throw new Error('Received error response');
		}

		// this.debugLog(JSON.stringify(data, null, 2));
	}

	private makeTrackMetadata(trackInfo: TrackInfo): TrackMetadata {
		const { artist, track, album, albumArtist, originUrl } = trackInfo;

		const trackMeta: TrackMetadata = {
			artist_name: artist,
			track_name: track,
			additional_info: {},
		};

		if (album) {
			trackMeta.release_name = album;
		}

		if (originUrl) {
			trackMeta.additional_info.origin_url = originUrl;
		}

		if (albumArtist) {
			trackMeta.additional_info.release_artist_name = albumArtist;
		}

		return trackMeta;
	}
}
