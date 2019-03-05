'use strict';

define((require) => {
	const ChromeStorage = require('storage/chrome-storage');

	/**
	 * List of scrobbler options.
	 * @type {Array}
	 */
	const SCROBBLER_OPTIONS = [
		/**
		 * Scrobbler label.
		 * @type {String}
		 */
		'label',
		/**
		 * Storage namespace in which scrobbler options are stored.
		 * @type {String}
		 */
		'storage',
		/**
		 * URL used to execute API methods.
		 * @type {String}
		 */
		'apiUrl',
		/**
		 * URL used to authenticate user.
		 * @type {String}
		 */
		'authUrl',
		/**
		 * URL used to view service status.
		 * @type {String}
		 */
		'statusUrl',
		/**
		 * URL used to view user profile.
		 * @type {String}
		 */
		'profileUrl',
	];

	/**
	 * Base scrobbler object.
	 *
	 * Ancestors of this object MUST return ServiceCallResult instance
	 * as result or error value in functions that perform API calls.
	 *
	 * Each scrobbler has its storage which can contain session data and/or
	 * other user data.
	 *
	 * Session data is an object with the following keys:
	 *   @param  {String} sessionID ID of a current session
	 *   @param  {String} sessionName a session name (username)
	 *   @param  {String} token a token that can be traded for a session ID
	 *
	 * Base scrobbler does not define how and when to write in the storage;
	 * it depends on module implementation or/and service features.
	 *
	 * Basic implementation relies on session data stored in the storage os it
	 * described above.
	 */
	class BaseScrobbler {
		/**
		 * @param {Object} options Scrobbler options
		 *
		 * @see {@link SCROBBLER_OPTIONS}
		 */
		constructor(options) {
			for (let option of SCROBBLER_OPTIONS) {
				this[option] = options[option];
			}

			this.storage = ChromeStorage.getScrobblerStorage(options.storage);
			this.storage.debugLog();
		}

		/** Authentication */

		/**
		 * Get auth URL where user should grant permission to the extension.
		 *
		 * Implementation must return a promise resolved with an auth URL.
		 */
		getAuthUrl() {
			throw new Error('No implemented');
		}

		/**
		 * Get session data.
		 *
		 * Implementation must return a promise resolved with a session data.
		 */
		getSession() {
			throw new Error('No implemented');
		}

		/**
		 * Remove session info.
		 * @return {Promise} Promise that will be resolved when the task has complete
		 */
		signOut() {
			return this.storage.get().then((data) => {
				// data.token = null;
				delete data.sessionID;
				delete data.sessionName;

				return this.storage.set(data);
			});
		}

		/**
		 * Check if the scrobbler is waiting until user grant access to
		 * scrobbler service (means the token is in Chrome storage).
		 * @return {Promise} Promise that will be resolved with check value
		 */
		isReadyForGrantAccess() {
			return this.storage.get().then((data) => {
				return data.token;
			});
		}

		/** API requests */

		/**
		 * Send current song as 'now playing' to API.
		 * @param  {Object} song Song instance
		 * Implementation must return promise resolved with ServiceCallResult object
		 */
		sendNowPlaying(song) { // eslint-disable-line no-unused-vars
			throw new Error('No implemented');
		}

		/**
		 * Send song to API to scrobble.
		 * @param  {Object} song Song instance
		 * Implementation must return promise resolved with ServiceCallResult object
		 */
		scrobble(song) { // eslint-disable-line no-unused-vars
			throw new Error('No implemented');
		}

		/**
		 * Love or unlove given song.
		 * @param  {Object} song Song instance
		 * @param  {Boolean} isLoved Flag means song should be loved or not
		 * Implementation must return promise resolved with ServiceCallResult object
		 */
		toggleLove(song, isLoved) { // eslint-disable-line no-unused-vars
			throw new Error('No implemented');
		}

		/**
		 * Get status page URL.
		 * @return {String} Status page URL
		 */
		getStatusUrl() {
			return this.statusUrl;
		}

		/**
		 * Get the scrobbler label.
		 * @return {String} Scrobbler label
		 */
		getLabel() {
			return this.label;
		}

		/**
		 * Get URL to profile page.
		 * @return {Promise} Promise that will be resolved with URL
		 */
		getProfileUrl() {
			return this.getSession().then((session) => {
				return `${this.profileUrl}${session.sessionName}`;
			});
		}

		/** Scrobbler features. */

		/**
		 * Check if service supports loving songs.
		 * @return {Boolean} True if service supports that; false otherwise
		 */
		canLoveSong() {
			return false;
		}

		/**
		 * Check if service supports retrieving of song info.
		 * @return {Boolean} True if service supports that; false otherwise
		 */
		canLoadSongInfo() {
			return false;
		}

		/**
		 * Check if service supports correction of song info.
		 * @return {Boolean} True if service supports that; false otherwise
		 */
		canCorrectSongInfo() {
			return false;
		}

		/** Misc */

		/**
		 * Helper function to show debug output.
		 * @param  {String} text Debug message
		 * @param  {String} type Log type
		 */
		debugLog(text, type = 'log') {
			let message = `${this.label}: ${text}`;

			switch (type) {
				case 'log':
					console.log(message);
					break;
				case 'warn':
					console.warn(message);
					break;
				case 'error':
					console.error(message);
					break;
			}
		}
	}

	return BaseScrobbler;
});
