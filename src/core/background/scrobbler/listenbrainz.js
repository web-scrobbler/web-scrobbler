'use strict';

/**
 * Module for all communication with LB
 */
define((require) => {
	const $ = require('jquery');
	const Util = require('util');
	const BaseScrobbler = require('scrobbler/base-scrobbler');
	const ServiceCallResult = require('object/service-call-result');
	const REQUEST_TIMEOUT = 15000;

	const listenBrainzTokenPage = 'https://listenbrainz.org/profile/';

	class ListenBrainz extends BaseScrobbler {

		// Pacify toggleLove requirement
		toggleLove() {
			throw new ServiceCallResult(ServiceCallResult.OK);
		}

		sendNowPlaying(song) {
			return this.getSession().then(({ sessionID }) => {
				let track_meta = {
					'artist_name': song.getArtist(),
					'track_name': song.getTrack(),
				};
				if (song.getAlbum()) {
					track_meta['release_name'] = song.getAlbum();
				}
				let params = {
					'listen_type': 'playing_now',
					'payload': [
						{
							'track_metadata': track_meta
						}
					]
				};
				return this.handleListenBrainzResponse(params, sessionID);
			});
		}

		scrobble(song) {
			return this.getSession().then(({ sessionID }) => {
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
				return this.handleListenBrainzResponse(params, sessionID);
			});
		}

		handleListenBrainzResponse(params, sessionID) {
			let promise = fetch(this.apiUrl, { method: 'POST',
				headers: { 'Authorization': `Token ${sessionID}`,
					'Content-Type': 'application/json; charset=UTF-8' },
				body: JSON.stringify(params) }).then((response) => {
				return response.text().then((text) => {
					if (response.status === 200) {
						this.debugLog(text, 'log');
						return new ServiceCallResult(ServiceCallResult.OK);
					} else if (response.status === 400) {
						this.debugLog('Invalid JSON sent to ListenBrainz', 'error');
						throw new ServiceCallResult(ServiceCallResult.IGNORED);
					} else if (response.status === 401) {
						this.debugLog('Invalid Authorization sent to ListenBrainz', 'error');
						throw new ServiceCallResult(ServiceCallResult.IGNORED);
					}
				});
			}).catch((error) => {
				this.debugLog(error.text(), 'warn');
				throw new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
			});
			return Util.timeoutPromise(REQUEST_TIMEOUT, promise).catch(() => {
				this.debugLog('TIMED OUT', 'warn');
				throw new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
			});
		}

		getAuthUrl() {
			return this.storage.get().then((data) => {
				delete data.sessionID;
				delete data.sessionName;
				// follow getSession method pattern by using a dummy token
				data.token = 'proofOfGoodAuthURL';

				let url = this.authUrl;
				return this.storage.set(data).then(() => {
					this.debugLog(`Auth url: ${url}`);
					return url;
				});
			}).catch(() => {
				return this.storage.get().then((data) => {
					delete data.token;
					return this.storage.set(data).then(() => {
						throw new Error('Error acquiring a token');
					});
				});
			});
		}

		getSession() {
			return this.storage.get().then((data) => {
				let token = data.token || null;
				if (token !== null) {
					// jump directly to doRequest as no method is available for ListenBrainz
					return this.customDoRequest().then((session) => {
						return this.storage.set(session).then(() => {
							return session;
						});
					}).catch(() => {
						this.debugLog('Failed to get session', 'warn');

						// both session and token are now invalid
						return this.signOut().then(() => {
							throw new ServiceCallResult(ServiceCallResult.ERROR_AUTH);
						});
					});
				} else if (!data.sessionID) {
					throw new ServiceCallResult(ServiceCallResult.ERROR_AUTH);
				} else {
					return {
						sessionID: data.sessionID,
						sessionName: data.sessionName
					};
				}
			});
		}

		customDoRequest() {
			let alreadySignedIn = fetch(listenBrainzTokenPage, {
				method: 'GET'
			}).then((response) => {
				return response.text().then((text) => {
					let $doc = $(text);
					let sessionName = $doc.find('.page-title').text();
					let sessionID = $doc.find('#auth-token').val();
					this.debugLog(sessionID, 'log');
					if (sessionID === null || typeof sessionID === 'undefined') {
						let needSignIn = fetch(this.authUrl, {
							method: 'GET'
						}).then((response) => {
							return response.text().then((text) => {
								let $doc = $(text);
								let sessionName = $doc.find('.page-title').text();
								let sessionID = $doc.find('#auth-token').val();
								this.debugLog(sessionID, 'log');
								if (sessionID === null || typeof sessionID === 'undefined') {
									// session is invalid
									return this.signOut().then(() => {
										this.debugLog(`response from: ${this.authUrl}`, 'error');
										throw new ServiceCallResult(ServiceCallResult.ERROR_AUTH);
									});
								}
								return { sessionID, sessionName };
							});
						});

						return Util.timeoutPromise(REQUEST_TIMEOUT, needSignIn).catch(() => {
							throw new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
						});
					}
					return { sessionID, sessionName };
				});
			});

			return Util.timeoutPromise(REQUEST_TIMEOUT, alreadySignedIn).catch(() => {
				throw new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
			});
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
