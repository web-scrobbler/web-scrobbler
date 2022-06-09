'use strict';

/**
 * Module for all communication with LB
 */
define((require) => {
	const Util = require('util/util');
	const BaseScrobbler = require('scrobbler/base-scrobbler');
	const ServiceCallResult = require('object/service-call-result');

	const listenBrainzTokenPage = 'https://listenbrainz.org/profile/';
	const apiUrl = 'https://api.listenbrainz.org/1/submit-listens';

	class ListenBrainz extends BaseScrobbler {
		/** @override */
		async getAuthUrl() {
			const data = await this.storage.get();

			data.isAuthStarted = true;
			delete data.sessionID;
			delete data.sessionName;
			await this.storage.set(data);

			return 'https://listenbrainz.org/login/musicbrainz?next=%2Fprofile%2F';
		}

		/** @override */
		getBaseProfileUrl() {
			return 'https://listenbrainz.org/user/';
		}

		/** @override */
		getId() {
			return 'listenbrainz';
		}

		/** @override */
		getLabel() {
			return 'ListenBrainz';
		}

		/** @override */
		async getProfileUrl() {
			if (this.userToken) {
				return null;
			}
			return super.getProfileUrl();
		}

		/** @override */
		getStatusUrl() {
			if (this.userToken) {
				return null;
			}

			return 'https://listenbrainz.org/current-status';
		}

		/** @override */
		getStorageName() {
			return 'ListenBrainz';
		}

		/** @override */
		getUsedDefinedProperties() {
			return ['userApiUrl', 'userToken'];
		}

		/** @override */
		async signOut() {
			if (this.userApiUrl || this.userToken) {
				await this.applyUserProperties({
					userApiUrl: null,
					userToken: null,
				});
			}
			await super.signOut();
		}

		/** @override */
		async getSession() {
			if (this.userToken) {
				return { sessionID: this.userToken };
			}

			const data = await this.storage.get();
			if (data.isAuthStarted) {
				let session = {};

				try {
					session = await this.requestSession();
				} catch (err) {
					this.debugLog('Failed to get session', 'warn');

					await this.signOut();
					throw ServiceCallResult.ERROR_AUTH;
				}

				data.sessionID = session.sessionID;
				data.sessionName = session.sessionName;
				delete data.isAuthStarted;
				await this.storage.set(data);

				return session;
			} else if (!data.sessionID) {
				throw ServiceCallResult.ERROR_AUTH;
			}

			return {
				sessionID: data.sessionID,
				sessionName: data.sessionName,
			};
		}

		/** @override */
		async isReadyForGrantAccess() {
			if (this.userToken) {
				return false;
			}

			const data = await this.storage.get();
			return data.isAuthStarted;
		}

		/** @override */
		async sendNowPlaying(song) {
			const { sessionID } = await this.getSession();
			const trackMeta = this.makeTrackMetadata(song);

			const params = {
				listen_type: 'playing_now',
				payload: [
					{
						track_metadata: trackMeta,
					},
				],
			};
			return this.sendRequest(params, sessionID);
		}

		/** @override */
		async scrobble(song) {
			const { sessionID } = await this.getSession();

			const params = {
				listen_type: 'single',
				payload: [
					{
						listened_at: song.metadata.startTimestamp,
						track_metadata: this.makeTrackMetadata(song),
					},
				],
			};
			return this.sendRequest(params, sessionID);
		}

		/** Private methods. */

		async sendRequest(params, sessionID) {
			const requestInfo = {
				method: 'POST',
				headers: {
					Authorization: `Token ${sessionID}`,
					'Content-Type': 'application/json; charset=UTF-8',
				},
				body: JSON.stringify(params),
			};
			const promise = fetch(this.userApiUrl || apiUrl, requestInfo);
			const timeout = BaseScrobbler.REQUEST_TIMEOUT;

			let result = null;
			let response = null;

			try {
				response = await Util.timeoutPromise(timeout, promise);
				result = await response.json();
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

			return this.processResult(result);
		}

		async requestSession() {
			const authUrls = [listenBrainzTokenPage, this.authUrl];

			let session = null;

			for (const url of authUrls) {
				try {
					session = await this.fetchSession(url);
				} catch (e) {
					this.debugLog('request session timeout', 'warn');
					continue;
				}

				if (session) {
					break;
				}
			}

			if (session) {
				const safeId = Util.hideObjectValue(session.sessionID);
				this.debugLog(`Session ID: ${safeId}`);

				return session;
			}

			throw ServiceCallResult.ERROR_AUTH;
		}

		async fetchSession(url) {
			this.debugLog(`Use ${url}`);
			// NOTE: Use 'same-origin' credentials to fix login on Firefox ESR 60.
			const promise = fetch(url, {
				method: 'GET',
				credentials: 'same-origin',
			});
			const timeout = BaseScrobbler.REQUEST_TIMEOUT;

			const response = await Util.timeoutPromise(timeout, promise);
			if (response.ok) {
				const parser = new DOMParser();

				const rawHtml = await response.text();
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

		processResult(result) {
			if (result.status !== 'ok') {
				return ServiceCallResult.ERROR_OTHER;
			}

			return ServiceCallResult.RESULT_OK;
		}

		makeTrackMetadata(song) {
			const trackMeta = {
				artist_name: song.getArtist(),
				track_name: song.getTrack(),
				additional_info: {},
			};

			if (song.getAlbum()) {
				trackMeta.release_name = song.getAlbum();
			}

			if (song.getOriginUrl()) {
				trackMeta.additional_info.origin_url = song.getOriginUrl();
			}

			if (song.getAlbumArtist()) {
				trackMeta.additional_info.release_artist_name = song.getAlbumArtist();
			}

			if (song.getUniqueId() && song.metadata.label === 'Spotify') {
				trackMeta.additional_info.spotify_id = song.getUniqueId();
			}

			if (song.getDuration()) {
				trackMeta.additional_info.duration = song.getDuration();
			}

			return trackMeta;
		}
	}

	return ListenBrainz;
});
