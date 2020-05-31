'use strict';

define((require) => {
	const Util = require('util/util');
	const BrowserStorage = require('storage/browser-storage');
	const ApiCallResult = require('object/api-call-result');

	/**
	 * Base scrobbler object.
	 *
	 * Descendants of this object MUST return ApiCallResult object
	 * as a result or as an error in functions that perform API calls.
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
		 * @constructor
		 */
		constructor() {
			this.initStorage();
			this.initUserProps();
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
			throw new Error('This function must be overridden!');
		}

		/**
		 * Get session data.
		 * Implementation must return a session data.
		 */
		async getSession() {
			throw new Error('This function must be overridden!');
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
			throw new Error('This function must be overridden!');
		}

		/** API requests */

		/**
		 * Send a now playing request.
		 * Implementation must return an ApiCallResult object.
		 *
		 * @param  {Object} songInfo Object containing song info
		 */
		// eslint-disable-next-line no-unused-vars
		async sendNowPlaying(songInfo) {
			throw new Error('This function must be overridden!');
		}

		/**
		 * Send a scrobble request.
		 * Implementation must return an ApiCallResult object.
		 *
		 * @param  {Object} songInfo Object containing song info
		 */
		// eslint-disable-next-line no-unused-vars
		async scrobble(songInfo) {
			throw new Error('This function must be overridden!');
		}

		/**
		 * Send an (un)love request.
		 * Implementation must return an ApiCallResult object.
		 *
		 * @param  {Object} songInfo Object containing song info
		 * @param  {Boolean} isLoved Flag means song should be loved or not
		 */
		// eslint-disable-next-line no-unused-vars
		async toggleLove(songInfo, isLoved) {
			throw new Error('This function must be overridden!');
		}

		/**
		 * Get information about song.
		 * Implementation must return object contains a song data.
		 *
		 * @param  {Object} songInfo Object containing song info
		 */
		// eslint-disable-next-line no-unused-vars
		async getSongInfo(songInfo) {
			throw new Error('This function must be overridden!');
		}

		/* Getters. */

		/**
		 * Get base profile URL.
		 */
		getBaseProfileUrl() {
			throw new Error('This function must be overridden!');
		}

		/**
		 * Get status page URL.
		 */
		getStatusUrl() {
			throw new Error('This function must be overridden!');
		}

		/**
		 * Get the scrobbler ID. The ID must be unique.
		 */
		getId() {
			throw new Error('This function must be overridden!');
		}

		/**
		 * Get the scrobbler label.
		 */
		getLabel() {
			throw new Error('This function must be overridden!');
		}

		/**
		 * Get URL to profile page.
		 * @return {String} Profile URL
		 */
		async getProfileUrl() {
			const { sessionName } = await this.getSession();
			return `${this.getBaseProfileUrl()}${sessionName}`;
		}

		/**
		 * Get a storage namespace where the scrobbler data will be stored.
		 */
		getStorageName() {
			throw new Error('This function must be overridden!');
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
		 * Return a new ApiCallResult object with the scrobbler ID attached.
		 *
		 * @param {String} resultType ApiCallResult type
		 * @return {Object} ApiCallResult object
		 */
		makeApiCallResult(resultType) {
			return new ApiCallResult(resultType, this.getId());
		}

		/**
		 * Helper function to show debug output.
		 * @param  {String} text Debug message
		 * @param  {String} [logType=log] Log type
		 */
		debugLog(text, logType = 'log') {
			const message = `${this.getLabel()}: ${text}`;
			Util.debugLog(message, logType);
		}

		/** Internal functions */

		async initStorage() {
			const sensitiveProps = ['token', 'sessionID', 'sessionName'];
			sensitiveProps.push(...this.getUsedDefinedProperties());

			this.storage = BrowserStorage.getScrobblerStorage(
				this.getStorageName()
			);
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
