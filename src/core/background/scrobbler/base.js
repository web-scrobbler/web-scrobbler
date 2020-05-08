'use strict';

define((require) => {
	const Util = require('util/util');
	const BrowserStorage = require('storage/browser-storage');

	/**
	 * Base scrobbler object.
	 *
	 * Descendants of this object MUST return ServiceCallResult constants
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
	 * Basic implementation relies on session data stored in the storage as it
	 * described above.
	 */
	class BaseScrobbler {
		/**
		 * @param {Object} properties Scrobbler properties
		 */
		constructor(properties) {
			this.applyProperties(properties);
			this.initStorage(properties.storage);
			this.initUserProps();
		}

		/**
		 * Apply scrobbler properties.
		 *
		 * Each property is a property used internally in scrobbler module.
		 * Properties are available as `this.propKey`.
		 *
		 * @param  {Array}  props Object contains scrobbler properties
		 */
		applyProperties(props) {
			this.applyProps(props, this.getRequiredProperties());
		}

		/**
		 * Apply user properties.
		 *
		 * Each property is a property used internally in scrobblers.
		 * Users can edit custom properties in the extension settings.
		 *
		 * @param  {Array}  props Object contains user properties
		 */
		async applyUserProperties(props) {
			this.applyProps(props, this.getUsedDefinedProperties());

			const data = await this.storage.get();
			if (!data.properties) {
				data.properties = {};
			}

			for (const prop in props) {
				const propValue = props[prop];
				if (propValue) {
					data.properties[prop] = propValue;
				} else {
					delete data.properties[prop];
				}
			}

			await this.storage.set(data);
		}

		/**
		 * Return a list of required scrobbler properties.
		 *
		 * @return {Array} A list of required scrobbler properties.
		 */
		getRequiredProperties() {
			return [
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
		}

		/**
		 * Return a list of user-defined scrobbler properties.
		 *
		 * @return {Array} a list of user-defined scrobbler properties.
		 */
		getUsedDefinedProperties() {
			return [];
		}

		/** Authentication */

		/**
		 * Get auth URL where user should grant permission to the extension.
		 * Implementation must return an auth URL.
		 */
		async getAuthUrl() {
			throw new Error('Not implemented');
		}

		/**
		 * Get session data.
		 * Implementation must return a session data.
		 */
		async getSession() {
			throw new Error('Not implemented');
		}

		/**
		 * Remove session info.
		 */
		async signOut() {
			const data = await this.storage.get();

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
			throw new Error('Not implemented');
		}

		/** API requests */

		/**
		 * Send current song as 'now playing' to API.
		 * Implementation must return ServiceCallResult constant.
		 *
		 * @param  {Object} song Song instance
		 */
		async sendNowPlaying(song) { // eslint-disable-line no-unused-vars
			throw new Error('Not implemented');
		}

		/**
		 * Send song to API to scrobble.
		 * Implementation must return ServiceCallResult constant.
		 *
		 * @param  {Object} song Song instance
		 */
		async scrobble(song) { // eslint-disable-line no-unused-vars
			throw new Error('Not implemented');
		}

		/**
		 * Love or unlove given song.
		 * Implementation must return ServiceCallResult constant.
		 *
		 * @param  {Object} song Song instance
		 * @param  {Boolean} isLoved Flag means song should be loved or not
		 */
		async toggleLove(song, isLoved) { // eslint-disable-line no-unused-vars
			throw new Error('Not implemented');
		}

		/**
		 * Get song info.
		 * Implementation must return object contains a song data.
		 *
		 * @param  {Object} song Song instance
		 */
		async getSongInfo(song) { // eslint-disable-line no-unused-vars
			throw new Error('Not implemented');
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
			const session = await this.getSession();
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
		 * @param  {String} [logType=log] Log type
		 */
		debugLog(text, logType = 'log') {
			const message = `${this.label}: ${text}`;
			Util.debugLog(message, logType);
		}

		/** Internal functions */

		async initStorage(storageName) {
			const sensitiveProps = ['token', 'sessionID', 'sessionName'];

			this.storage = BrowserStorage.getScrobblerStorage(storageName);
			this.storage.debugLog(sensitiveProps);
		}

		async initUserProps() {
			const { properties } = await this.storage.get();
			for (const prop in properties) {
				this[prop] = properties[prop];
			}
		}

		applyProps(props, allowedProps) {
			for (const prop in props) {
				if (!allowedProps.includes(prop)) {
					throw new Error(`Unknown property: ${prop}`);
				}

				const propValue = props[prop];

				if (propValue === undefined) {
					throw new Error(`Property is not set: ${prop}`);
				}

				if (propValue) {
					this[prop] = props[prop];
				} else {
					delete this[prop];
				}
			}
		}
	}

	return BaseScrobbler;
});
