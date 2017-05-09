'use strict';

/**
 * Service to handle all scrobbling behaviour.
 */
define([
	'notifications'
], function (Notifications) {

	/**
	 * Scrobblers that are bound, meaning they have valid session IDs.
	 *
	 * @type {Array}
	 */
	var boundScrobblers = [];

	/**
	 * Scrobblers that are registered and that can be bound.
	 *
	 * @type {Array}
	 */
	var registeredScrobblers = [];

	/**
	 * Check if scrobbler is in given array of scrobblers.
	 * @param  {Object} scrobbler Scrobbler instance
	 * @param  {Array} array Array of scrobblers
	 * @return {Boolean} True if scrobbler is in array, false otherwise
	 */
	function isScrobblerInArray(scrobbler, array) {
		return array.some(s => {
			return s.getLabel() === scrobbler.getLabel();
		});
	}

	/**
	 * Register given scrobbler.
	 * @param {Object} scrobbler Scrobbler instance
	 */
	function registerScrobbler(scrobbler) {
		if (!isScrobblerInArray(scrobbler, registeredScrobblers)) {
			console.log('ScrobbleService: registerScrobbler(): ' + scrobbler.getLabel());
			registeredScrobblers.push(scrobbler);
		}
	}

	return {
		/**
		 * Register given scrobblers.
		 * @param {Array} unboundScrobblers Array of unbound scrobbler instances
		 * @returns {Promise} Promise that will resolve with array of bound scrobblers
		 */
		registerScrobblers: function(unboundScrobblers) {
			// Convert each `getSession` call into Promise
			let promises = unboundScrobblers.map(scrobbler => {
				registerScrobbler(scrobbler);
				return scrobbler.getSession().then(() => {
					this.bindScrobbler(scrobbler);
				}).catch(() => {
					console.warn(`ScrobbleService: Unable to bind ${scrobbler.getLabel()}`);
				});
			});

			return Promise.all(promises).then(() => boundScrobblers);
		},

		/**
		 * Bind given scrobbler.
		 * @param {Object} scrobbler Scrobbler instance
		 */
		bindScrobbler: function (scrobbler) {
			if (!isScrobblerInArray(scrobbler, boundScrobblers)) {
				boundScrobblers.push(scrobbler);
				console.log('ScrobbleService: bindScrobbler() ' + scrobbler.getLabel() + ' total:' + boundScrobblers.length);
			}
		},

		/**
		 * Unbind given scrobbler.
		 * @param {Object} scrobbler Scrobbler instance
		 */
		unbindScrobbler: function (scrobbler) {
			if (isScrobblerInArray(scrobbler, boundScrobblers)) {
				boundScrobblers = boundScrobblers.filter(function (s) {
					return s !== scrobbler;
				});

				console.log('ScrobbleService: unbindScrobbler() ' + scrobbler.getLabel() + ' total:' + boundScrobblers.length);
			} else {
				console.error(`${scrobbler.getLabel()} is not bound`);
			}
		},

		/**
		 * Ask user for grant access for service covered by given scrobbler.
		 * @param  {Object} scrobbler Scrobbler instance
		 * @param  {Object} notify Use notifications to ask for authentication
		 */
		authenticateScrobbler: function (scrobbler, notify = true) {
			let label = scrobbler.getLabel();

			scrobbler.getAuthUrl().then((authUrl) => {
				this.bindScrobbler(scrobbler);
				if (notify) {
					Notifications.showAuthenticate(label, authUrl);
				} else {
					chrome.tabs.create({ url: authUrl });
				}
			}).catch(() => {
				console.log(`ScrobbleService: Unable to get auth URL for ${label}`);

				let statusUrl = scrobbler.getStatusUrl();
				Notifications.showSignInError(label, statusUrl);
			});
		},

		/**
		 * Send now playing notification to each bound scrobbler.
		 * @param  {Object} song Song instance
		 * @return {Promise} Promise that will be resolved then the task will complete
		 */
		sendNowPlaying: function (song) {
			console.log(`ScrobbleService: sendNowPlaying() ${boundScrobblers.length}`);

			return Promise.all(boundScrobblers.map((scrobbler) => {
				// Forward result (including errors) to caller
				return scrobbler.sendNowPlaying(song).catch((result) => {
					if (result.isAuthError()) {
						this.unbindScrobbler(scrobbler);
					}
					return result;
				});
			}));
		},

		/**
		 * Scrobble song to each bound scrobbler.
		 * @param  {Object} song Song instance
		 * @return {Promise} Promise that will be resolved then the task will complete
		 */
		scrobble: function (song) {
			console.log(`ScrobbleService: scrobble() ${boundScrobblers.length}`);

			return Promise.all(boundScrobblers.map((scrobbler) => {
				// Forward result (including errors) to caller
				return scrobbler.scrobble(song).catch((result) => {
					if (result.isAuthError()) {
						this.unbindScrobbler(scrobbler);
					}
					return result;
				});
			}));
		},

		/**
		 * Get all bound scrobblers.
		 * @returns {Array} Array of bound scrobblers
		 */
		getAllBound: function() {
			return boundScrobblers;
		},

		/**
		 * Get scrobbler by label.
		 * @param  {String} label Scrobbler label
		 * @return {Object} Found scrobbler object
		 */
		getScrobblerByLabel: function(label) {
			for (let scrobbler of registeredScrobblers) {
				if (scrobbler.getLabel() === label) {
					return scrobbler;
				}
			}

			return null;
		}
	};
});
