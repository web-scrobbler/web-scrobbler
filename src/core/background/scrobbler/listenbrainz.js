'use strict';

/**
 * Module for all communication with LB
 */
define((require) => {
	const $ = require('jquery');
	const Util = require('util');
	const BaseScrobbler = require('scrobbler/base');
	const ServiceCallResult = require('object/service-call-result');

	const listenBrainzTokenPage = 'https://listenbrainz.org/profile/';

	class ListenBrainz extends BaseScrobbler {
		/** @override */
		async getAuthUrl() {
			let data = await this.storage.get();

			data.isAuthStarted = true;
			delete data.sessionID;
			delete data.sessionName;
			await this.storage.set(data);

			this.debugLog(`Auth url: ${this.authUrl}`);

			return this.authUrl;
		}

		/** @override */
		async getSession() {
			let data = await this.storage.get();
			if (data.isAuthStarted) {
				let session = {};

				try {
					session = await this.requestSession();
				} catch (err) {
					this.debugLog('Failed to get session', 'warn');

					await this.signOut();
					throw new ServiceCallResult(ServiceCallResult.ERROR_AUTH);
				}

				data.sessionID = session.sessionID;
				data.sessionName = session.sessionName;
				delete data.isAuthStarted;
				await this.storage.set(data);

				return session;
			} else if (!data.sessionID) {
				throw new ServiceCallResult(ServiceCallResult.ERROR_AUTH);
			}

			return {
				sessionID: data.sessionID,
				sessionName: data.sessionName
			};
		}

		/** @override */
		async isReadyForGrantAccess() {
			let data = await this.storage.get();
			return data.isAuthStarted;
		}

		/** @override */
		async sendNowPlaying(song) {
			let { sessionID } = await this.getSession();
			let track_meta = {
				'artist_name': song.getArtist(),
				'track_name': song.getTrack(),
			};

			if (song.getAlbum()) {
				track_meta['release_name'] = song.getAlbum();
			}

			if (song.getOriginUrl()) {
				track_meta['additional_info'] = {
					'origin_url': song.getOriginUrl()
				};
			}

			let params = {
				'listen_type': 'playing_now',
				'payload': [
					{
						'track_metadata': track_meta
					}
				]
			};

			return this.sendRequest(params, sessionID);
		}

		/** @override */
		async scrobble(song) {
			let { sessionID } = await this.getSession();

			let track_meta = {
				'artist_name': song.getArtist(),
				'track_name': song.getTrack(),
			};
			if (song.getAlbum()) {
				track_meta['release_name'] = song.getAlbum();
			}
			let params = {
				'listen_type': 'single',
				'payload': [
					{
						'listened_at': song.metadata.startTimestamp,
						'track_metadata': track_meta
					}
				]
			};
			return this.sendRequest(params, sessionID);
		}

		sendRequest(params, sessionID) {
			let requestInfo = {
				method: 'POST',
				headers: {
					'Authorization': `Token ${sessionID}`,
					'Content-Type': 'application/json; charset=UTF-8'
				},
				body: JSON.stringify(params)
			};

			let promise = fetch(this.apiUrl, requestInfo).then((response) => {
				switch (response.status) {
					case 400:
						this.debugLog('Invalid JSON sent to ListenBrainz', 'error');
						throw new ServiceCallResult(ServiceCallResult.IGNORED);
					case 401:
						this.debugLog('Invalid Authorization sent to ListenBrainz', 'error');
						throw new ServiceCallResult(ServiceCallResult.IGNORED);
				}

				return response.text();
			}).then((text) => {
				this.debugLog(text, 'log');
				return new ServiceCallResult(ServiceCallResult.OK);
			}).catch((error) => {
				this.debugLog(error.text(), 'warn');
				throw new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
			});

			let timeout = BaseScrobbler.REQUEST_TIMEOUT;
			return Util.timeoutPromise(timeout, promise).catch(() => {
				this.debugLog('TIMED OUT', 'warn');
				throw new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
			});
		}

		async requestSession() {
			let authUrls = [
				listenBrainzTokenPage,
				this.authUrl,
			];

			let session = null;

			for (let url of authUrls) {
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
				let safeId = Util.hideString(session.sessionID);
				this.debugLog(`Session ID: ${safeId}`, 'log');

				return session;
			}

			throw new ServiceCallResult(ServiceCallResult.ERROR_AUTH);
		}

		async fetchSession(url) {
			this.debugLog(`Use ${url}`);
			let promise = fetch(url, { method: 'GET' });
			let timeout = BaseScrobbler.REQUEST_TIMEOUT;

			let response = await Util.timeoutPromise(timeout, promise);
			let $doc = $(await response.text());

			let sessionName = $doc.find('.page-title').text();
			let sessionID = $doc.find('#auth-token').val();

			if (sessionID && sessionName) {
				return { sessionID, sessionName };
			}

			return null;
		}
	}

	return new ListenBrainz({
		label: 'ListenBrainz',
		storage: 'ListenBrainz',
		apiUrl: 'https://api.listenbrainz.org/1/submit-listens',
		authUrl: 'https://listenbrainz.org/login/musicbrainz?next=%2Fprofile%2F',
		statusUrl: 'https://listenbrainz.org/current-status',
		profileUrl: 'https://listenbrainz.org/user/',
	});
});
