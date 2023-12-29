'use strict';

import { ServiceCallResult } from '@/core/object/service-call-result';
import { BaseSong } from '@/core/object/song';
import * as Util from '@/util/util';
import { getExtensionVersion } from '@/util/util-browser';
import BaseScrobbler, { SessionData } from '@/core/scrobbler/base-scrobbler';
import {
	ListenBrainzParams,
	ListenBrainzTrackMeta,
	MetadataLookup,
} from './listenbrainz.types';
import { sendContentMessage } from '@/util/communication';

/**
 * Module for all communication with LB
 */

const listenBrainzTokenPage = 'https://listenbrainz.org/profile/';
const baseUrl = 'https://api.listenbrainz.org/1';
const apiUrl = `${baseUrl}/submit-listens`;
export default class ListenBrainzScrobbler extends BaseScrobbler<'ListenBrainz'> {
	public userApiUrl!: string;
	public userToken!: string;
	public isLocalOnly = false;

	public async getSongInfo(): Promise<Record<string, never>> {
		return Promise.resolve({});
	}

	/** @override */
	public async getAuthUrl(): Promise<string> {
		const data = await this.storage.get();
		let properties:
			| {
					userApiUrl: string;
					userToken: string;
			  }
			| undefined;
		if (data && 'properties' in data) {
			properties = data.properties;
		}
		if (properties) {
			await this.storage.set({ isAuthStarted: true, properties });
		} else {
			await this.storage.set({ isAuthStarted: true });
		}

		return 'https://listenbrainz.org/login/musicbrainz?next=%2Fprofile%2F';
	}

	/** @override */
	protected getBaseProfileUrl(): string {
		return 'https://listenbrainz.org/user/';
	}

	/** @override */
	public getLabel(): 'ListenBrainz' {
		return 'ListenBrainz';
	}

	/** @override */
	public async getProfileUrl(): Promise<string> {
		if (this.userToken) {
			return '';
		}

		return await super.getProfileUrl();
	}

	/** @override */
	public getStatusUrl(): string {
		if (this.userToken) {
			return '';
		}

		return 'https://listenbrainz.org/current-status';
	}

	/** @override */
	protected getStorageName(): 'ListenBrainz' {
		return 'ListenBrainz';
	}

	/** @override */
	public getUserDefinedProperties(): string[] {
		return ['userApiUrl', 'userToken'];
	}

	/** @override */
	public async signOut(): Promise<void> {
		if (this.userApiUrl || this.userToken) {
			await this.applyUserProperties({
				userApiUrl: null,
				userToken: null,
			});
		}
		await super.signOut();
	}

	/** @override */
	public async getSession(): Promise<SessionData> {
		if (this.userToken) {
			return { sessionID: this.userToken };
		}

		const data = await this.storage.get();
		if (!data) {
			this.debugLog('no data', 'error');
			await this.signOut();
			throw ServiceCallResult.ERROR_AUTH;
		}

		if ('isAuthStarted' in data && data.isAuthStarted) {
			try {
				const session = await this.requestSession();

				/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access -- we need to set session even if not exists */
				(data as any).sessionID = session.sessionID;
				(data as any).sessionName = session.sessionName;
				/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
				delete data.isAuthStarted;

				await this.storage.set(data);

				return session;
			} catch (err) {
				this.debugLog('Failed to get session', 'warn');

				await this.signOut();
				throw ServiceCallResult.ERROR_AUTH;
			}
		} else if (!('sessionID' in data) || !data.sessionID) {
			throw ServiceCallResult.ERROR_AUTH;
		}

		return {
			sessionID: data.sessionID,
			sessionName: data.sessionName,
		};
	}

	/** @override */
	public async isReadyForGrantAccess(): Promise<boolean> {
		if (this.userToken) {
			return false;
		}

		const data = await this.storage.get();
		if (!data || !('isAuthStarted' in data)) {
			return false;
		}

		return data.isAuthStarted ?? false;
	}

	/** @override */
	async sendNowPlaying(song: BaseSong): Promise<ServiceCallResult> {
		const { sessionID } = await this.getSession();
		const trackMeta = this.makeTrackMetadata(song);

		const params = {
			listen_type: 'playing_now',
			payload: [
				{
					track_metadata: trackMeta,
				},
			],
		} as ListenBrainzParams;
		return this.sendScrobbleRequest(params, sessionID);
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
	public async scrobble(song: BaseSong): Promise<ServiceCallResult> {
		const { sessionID } = await this.getSession();

		const params = {
			listen_type: 'single',
			payload: [
				{
					listened_at: song.metadata.startTimestamp,
					track_metadata: this.makeTrackMetadata(song),
				},
			],
		} as ListenBrainzParams;
		return this.sendScrobbleRequest(params, sessionID);
	}

	/** @override */
	async toggleLove(song: BaseSong, isLoved: boolean) {
		// https://listenbrainz.readthedocs.io/en/latest/users/api-usage.html#lookup-mbids
		const track = song.getTrack();
		const artist = song.getArtist();
		if (typeof track !== 'string' || typeof artist !== 'string') {
			throw new Error(
				`Invalid track ${JSON.stringify({ artist, track })}`,
			);
		}
		const lookupRequestParams = new URLSearchParams({
			recording_name: track,
			artist_name: artist,
		});

		let lookupResult: MetadataLookup = {};

		try {
			lookupResult = await this.listenBrainzApi<MetadataLookup>(
				'GET',
				`${baseUrl}/metadata/lookup?${lookupRequestParams.toString()}`,
				null,
				null,
			);
		} catch (e) {
			// ignore error
		}

		this.debugLog(
			`lookup result: ${JSON.stringify(lookupResult, null, 2)}`,
		);

		if (!lookupResult.recording_mbid) {
			this.debugLog(
				`Could not lookup metadata for song: ${song.toString()}`,
			);
			return {};
		}

		// https://listenbrainz.readthedocs.io/en/latest/users/api-usage.html#love-hate-feedback
		const { sessionID } = await this.getSession();
		const loveRequestBody = {
			recording_mbid: lookupResult.recording_mbid,
			score: isLoved ? 1 : 0,
		};
		const loveResult = await this.listenBrainzApi(
			'POST',
			`${baseUrl}/feedback/recording-feedback`,
			loveRequestBody,
			sessionID,
		);

		return this.processResult(loveResult);
	}

	/** @override */
	canLoveSong() {
		return true;
	}

	/** Private methods. */

	private async listenBrainzApi<
		T extends Record<string, unknown> = Record<string, unknown>,
	>(
		method: string,
		url: string,
		body: ListenBrainzParams | null,
		sessionID: string | null,
	): Promise<T> {
		const requestInfo: RequestInit = {
			method,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
			},
		};

		if (body) {
			requestInfo.body = JSON.stringify(body);
		}

		if (sessionID && requestInfo.headers) {
			(requestInfo.headers as Record<string, string>).Authorization =
				`Token ${sessionID}`;
		}
		const promise = fetch(url, requestInfo);
		const timeout = this.REQUEST_TIMEOUT;

		let result: T | null = null;
		let response: Response | null = null;

		try {
			response = await Util.timeoutPromise(timeout, promise);
			result = (await response.json()) as T;
		} catch (e) {
			this.debugLog('Error while sending request', 'error');
			throw ServiceCallResult.ERROR_OTHER;
		}

		switch (response.status) {
			case 400:
				this.debugLog('Invalid JSON sent', 'error');
				throw ServiceCallResult.ERROR_AUTH;
			case 401:
				this.debugLog('Invalid Authorization sent', 'error');
				throw ServiceCallResult.ERROR_AUTH;
		}

		this.debugLog(JSON.stringify(result, null, 2));

		return result;
	}

	async sendScrobbleRequest(
		params: ListenBrainzParams,
		sessionID: string,
	): Promise<ServiceCallResult> {
		const result = await this.listenBrainzApi(
			'POST',
			this.userApiUrl || apiUrl,
			params,
			sessionID,
		);
		return this.processResult(result);
	}

	private async requestSession() {
		let session = null;

		try {
			session = await this.fetchSession(listenBrainzTokenPage);
		} catch (e) {
			this.debugLog('request session timeout', 'warn');
		}

		if (session) {
			const safeId = Util.hideObjectValue(session.sessionID);
			this.debugLog(`Session ID: ${safeId}`);

			return session;
		}

		throw ServiceCallResult.ERROR_AUTH;
	}

	private async fetchSession(url: string) {
		this.debugLog(`Use ${url}`);

		// safari does not send cookies in content requests. Use background script to send.
		// however, if already in background script, send directly as messaging will fail.
		const promise = Util.isBackgroundScript()
			? Util.fetchListenBrainzProfile(url)
			: sendContentMessage({
					type: 'sendListenBrainzRequest',
					payload: {
						url,
					},
				});
		const timeout = this.REQUEST_TIMEOUT;

		// @ts-expect-error typescript is confused by the combination of ternary and promise wrapped promise. It's a skill issue on typescript's part.
		const rawHtml = await Util.timeoutPromise(timeout, promise);

		if (rawHtml !== null) {
			const parser = new DOMParser();

			const doc = parser.parseFromString(rawHtml, 'text/html');

			let sessionName = null;
			let sessionID = null;
			const sessionNameEl = doc.querySelector('.page-title');
			const sessionIdEl = doc.querySelector('#auth-token');

			if (sessionNameEl) {
				sessionName = sessionNameEl.textContent;
			}
			if (sessionIdEl) {
				sessionID = sessionIdEl.getAttribute('value');
			}

			if (sessionID && sessionName) {
				return { sessionID, sessionName };
			}
		}

		return null;
	}

	private processResult(result: Record<string, unknown>): ServiceCallResult {
		if (result.status !== 'ok') {
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

		if (originUrl && song.metadata.label === 'Spotify') {
			trackMeta.additional_info.spotify_id = originUrl;
		}

		const duration = song.getDuration();
		if (duration) {
			trackMeta.additional_info.duration = duration;
		}

		return trackMeta;
	}
}
