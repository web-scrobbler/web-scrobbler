'use strict';

define((require) => {
	const Util = require('util/util');
	const BrowserStorage = require('storage/browser-storage');

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
	 * Descendants of this object MUST return ServiceCallResult instance
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
			this.applyOptions(options, SCROBBLER_OPTIONS);

			this.storage = BrowserStorage.getScrobblerStorage(options.storage);
			this.storage.debugLog();
		}

		/**
		 * Apply scrobbler options.
		 *
		 * Each option is a property used internally in scrobbler module.
		 * Options are available as `this.optionKey`.
		 *
		 * @param  {Array}  options    Object contains option values
		 * @param  {Object} optionsArr Array of allowed options
		 */
		applyOptions(options, optionsArr) {
			for (let option of optionsArr) {
				if (options[option] === undefined) {
					throw new Error(`Option ${option} is not set`);
				}

				this[option] = options[option];
			}
		}

		/** Authentication */

		/**
		 * Get auth URL where user should grant permission to the extension.
		 *
		 * Implementation must return an auth URL.
		 */
		async getAuthUrl() {
			throw new Error('No implemented');
		}

		/**
		 * Get session data.
		 *
		 * Implementation must return a session data.
		 */
		async getSession() {
			throw new Error('No implemented');
		}

		/**
		 * Remove session info.
		 */
		async signOut() {
			let data = await this.storage.get();

			delete data.sessionID;
			delete data.sessionName;

			await this.storage.set(data);
		}

		/**
		 * Check if the scrobbler is waiting until user grant access to
		 * scrobbler service.
		 * Implementation must return a check result as a boolean value.
		 */
		async isReadyForGrantAccess() {
			throw new Error('No implemented');
		}

		/** API requests */

		/**
		 * Send current song as 'now playing' to API.
		 * @param  {Object} song Song instance
		 * Implementation must return ServiceCallResult object as a result
		 */
		async sendNowPlaying(song) { // eslint-disable-line no-unused-vars
			throw new Error('No implemented');
		}

		/**
		 * Send song to API to scrobble.
		 * @param  {Object} song Song instance
		 * Implementation must return ServiceCallResult object.
		 */
		async scrobble(song) { // eslint-disable-line no-unused-vars
			throw new Error('No implemented');
		}

		/**
		 * Love or unlove given song.
		 * @param  {Object} song Song instance
		 * @param  {Boolean} isLoved Flag means song should be loved or not
		 * Implementation must return ServiceCallResult object.
		 */
		async toggleLove(song, isLoved) { // eslint-disable-line no-unused-vars
			throw new Error('No implemented');
		}

		/**
		 * Get song info.
		 *
		 * @param  {Song} song Song instance
		 * Implementation must return object contains a song data.
		 */
		async getSongInfo(song) { // eslint-disable-line no-unused-vars
			throw new Error('No implemented');
		}

		/** Getters. */

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
		 * @return {String} Profile URL
		 */
		async getProfileUrl() {
			let session = await this.getSession();
			return `${this.profileUrl}${session.sessionName}`;
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

		/** Constants */

		/**
		 * Get timeout of all API requests in milliseconds.
		 * @type {Number}
		 */
		static get REQUEST_TIMEOUT() {
			return 15000;
		}

		/** Misc */

		/**
		 * Helper function to show debug output.
		 * @param  {String} text Debug message
		 * @param  {String} logType Log type
		 */
		debugLog(text, logType = 'log') {
			const message = `${this.label}: ${text}`;
			Util.debugLog(message, logType);
		}
	}

	return BaseScrobbler;
});
