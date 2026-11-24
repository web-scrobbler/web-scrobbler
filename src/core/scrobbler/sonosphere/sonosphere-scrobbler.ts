'use strict';

import { ServiceCallResult } from '@/core/object/service-call-result';
import type { BaseSong } from '@/core/object/song';
import { timeoutPromise, hideObjectValue } from '@/util/util';
import { getExtensionVersion } from '@/util/util-browser';
import type { SessionData } from '@/core/scrobbler/base-scrobbler';
import BaseScrobbler from '@/core/scrobbler/base-scrobbler';
import type {
	ListenBrainzParams,
	ListenBrainzTrackMeta,
} from '@/core/scrobbler/listenbrainz/listenbrainz.types';

/**
 * Module for communication with Sonosphere.
 *
 * Sonosphere serves a ListenBrainz-compatible API at https://sonosphere.fm/1/,
 * authenticated with a per-user token from Settings > Applications.
 * https://sonosphere.fm/developers
 */

const baseUrl = 'https://sonosphere.fm';
const apiUrl = `${baseUrl}/1`;

interface ValidateTokenResponse {
	valid?: boolean;
	user_name?: string;
}

export default class SonosphereScrobbler extends BaseScrobbler<'Sonosphere'> {
	public isLocalOnly = true;

	/**
	 * Cached result of validate-token, keyed by the token it was made with.
	 * Holds at most one entry.
	 */
	private validatedSessions = new Map<string, SessionData>();

	/** @override */
	protected getStorageName(): 'Sonosphere' {
		return 'Sonosphere';
	}

	/** @override */
	public getLabel(): 'Sonosphere' {
		return 'Sonosphere';
	}

	/** @override */
	public getStatusUrl(): string {
		return '';
	}

	/** @override */
	public getUserDefinedProperties(): string[] {
		return ['userToken'];
	}

	/** @override */
	public async getAuthUrl(): Promise<string> {
		return Promise.resolve(`${baseUrl}/settings/applications`);
	}

	/** @override */
	protected getBaseProfileUrl(): string {
		return `${baseUrl}/user/`;
	}

	/** @override */
	public async getProfileUrl(): Promise<string> {
		const { sessionName } = await this.getSession();
		if (!sessionName) {
			return baseUrl;
		}
		return `${this.getBaseProfileUrl()}${encodeURIComponent(sessionName)}`;
	}

	/** @override */
	public getSongInfo(): Promise<Record<string, never>> {
		return Promise.resolve({});
	}

	/** @override */
	public toggleLove(): Promise<ServiceCallResult> {
		// Sonosphere's feedback endpoint needs MBIDs/MSIDs we don't have.
		return Promise.resolve(ServiceCallResult.ERROR_OTHER);
	}

	/** @override */
	public async signOut(): Promise<void> {
		this.validatedSessions.clear();
		if (this.userToken) {
			await this.applyUserProperties({ userToken: null });
		}
		await super.signOut();
	}

	/** @override */
	public async getSession(): Promise<SessionData> {
		const token = this.userToken?.trim();
		if (!token) {
			throw new Error(ServiceCallResult.ERROR_AUTH);
		}

		const cached = this.validatedSessions.get(token);
		if (cached) {
			return { ...cached };
		}

		let result: ValidateTokenResponse;
		try {
			const response = await timeoutPromise(
				this.REQUEST_TIMEOUT,
				fetch(`${apiUrl}/validate-token`, {
					method: 'GET',
					headers: { Authorization: `Token ${token}` },
				}),
			);
			result = (await response.json()) as ValidateTokenResponse;
		} catch (e) {
			this.debugLog(`Error while validating token: ${e}`, 'error');
			throw new Error(ServiceCallResult.ERROR_AUTH);
		}

		if (!result.valid) {
			this.debugLog(`Invalid token ${hideObjectValue(token)}`, 'warn');
			throw new Error(ServiceCallResult.ERROR_AUTH);
		}

		const session = { sessionID: token, sessionName: result.user_name };
		this.validatedSessions.clear();
		this.validatedSessions.set(token, session);
		return { ...session };
	}

	/** @override */
	public isReadyForGrantAccess(): Promise<boolean> {
		return Promise.resolve(false);
	}

	/** @override */
	async sendNowPlaying(song: BaseSong): Promise<ServiceCallResult> {
		const { sessionID } = await this.getSession();
		const params = {
			listen_type: 'playing_now',
			payload: [{ track_metadata: this.makeTrackMetadata(song) }],
		} as ListenBrainzParams;
		return this.submitListens(params, sessionID);
	}

	/** @override */
	async sendPaused(): Promise<ServiceCallResult> {
		return Promise.resolve(ServiceCallResult.RESULT_OK);
	}

	/** @override */
	async sendResumedPlaying(): Promise<ServiceCallResult> {
		return Promise.resolve(ServiceCallResult.RESULT_OK);
	}

	/** @override */
	public async scrobble(
		songs: BaseSong[],
		currentlyPlaying: boolean,
	): Promise<ServiceCallResult[]> {
		const { sessionID } = await this.getSession();
		const batch = songs.slice(0, 50);
		const params = {
			listen_type:
				currentlyPlaying && batch.length === 1 ? 'single' : 'import',
			payload: batch.map((song) => ({
				listened_at: song.metadata.startTimestamp,
				track_metadata: this.makeTrackMetadata(song),
			})),
		} as ListenBrainzParams;
		const res = await this.submitListens(params, sessionID);
		return new Array<ServiceCallResult>(batch.length).fill(res);
	}

	/** Private methods. */

	private async submitListens(
		params: ListenBrainzParams,
		sessionID: string,
	): Promise<ServiceCallResult> {
		let response: Response;
		let result: Record<string, unknown>;
		try {
			response = await timeoutPromise(
				this.REQUEST_TIMEOUT,
				fetch(`${apiUrl}/submit-listens`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json; charset=UTF-8',
						Authorization: `Token ${sessionID}`,
					},
					body: JSON.stringify(params),
				}),
			);
			result = (await response.json()) as Record<string, unknown>;
		} catch (e) {
			this.debugLog(`Error while sending request: ${e}`, 'error');
			return ServiceCallResult.ERROR_OTHER;
		}

		this.debugLog(JSON.stringify(result, null, 2));

		if (response.status === 401) {
			this.validatedSessions.clear();
			return ServiceCallResult.ERROR_AUTH;
		}
		if (!response.ok || result.status !== 'ok') {
			return ServiceCallResult.ERROR_OTHER;
		}
		return ServiceCallResult.RESULT_OK;
	}

	private makeTrackMetadata(song: BaseSong): ListenBrainzTrackMeta {
		const trackMeta: ListenBrainzTrackMeta = {
			artist_name: song.getArtist() ?? '',
			track_name: song.getTrack() ?? '',
			additional_info: {
				submission_client: 'Web Scrobbler',
				submission_client_version: getExtensionVersion(),
				music_service_name: song.metadata.label,
			},
		};

		const album = song.getAlbum();
		if (album) {
			trackMeta.release_name = album;
		}

		const originUrl = song.getOriginUrl();
		if (originUrl) {
			trackMeta.additional_info.origin_url = originUrl;
		}

		const albumArtist = song.getAlbumArtist();
		if (albumArtist) {
			trackMeta.additional_info.release_artist_name = albumArtist;
		}

		const duration = song.getDuration();
		if (duration) {
			trackMeta.additional_info.duration = duration;
		}

		return trackMeta;
	}
}
