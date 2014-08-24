'use strict';
define(function() {
	return {
		/**
		 * L.FM API info - used in legacy/scrobbler
		 */
		apiURL: 'https://ws.audioscrobbler.com/2.0/?',
		apiKey: 'd9bb1870d3269646f740544d9def2c95',

		/**
		 * Paths to jQuery, which is always included with any connector
		 */
		JQUERY_1_6_PATH: 'vendor/jquery-1.6.1.min.js',
		JQUERY_PATH: 'vendor/jquery-2.1.0.min.js',

		/**
		 * Page action icons
		 */
		ICON_LOGO: 'icon.png',                      // Audioscrobbler logo
		ICON_UNKNOWN: 'icon_unknown.png',           // not recognized
		ICON_NOTE: 'icon_note.png',                 // now playing
		ICON_NOTE_DISABLED: 'icon_note_gray.png',   // disabled
		ICON_TICK: 'icon_tick.png',                 // scrobbled
		ICON_TICK_DISABLED: 'icon_tick_gray.png',   // disabled
		ICON_CONN_DISABLED: 'icon_cross_gray.png',  // connector is disabled

		/**
		 * Icon - title - popup set identificators
		 */
		ACTION_UNKNOWN: 1,
		ACTION_NOWPLAYING: 2,
		ACTION_SCROBBLED: 3,
		ACTION_UPDATED: 4,
		ACTION_DISABLED: 5,
		ACTION_REENABLED: 6,
		ACTION_CONN_DISABLED: 7,
		ACTION_SITE_RECOGNIZED: 8,
		ACTION_SITE_DISABLED: 9,


		/**
		 * @param {String} label
		 * @returns boolean
		 */
		isConnectorEnabled: function(label) {
			var disabledArray = JSON.parse(localStorage.disabledConnectors);
			return (disabledArray.indexOf(label) === -1);
		}

	};
});
