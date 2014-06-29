'use strict';

/**
 * Helper functions which could be nice to have in separate module
 */
define([
	'wrappers/can'
], function(can) {
	return {

		/**
		 * Returns a new song object. Use this factory method for object to always
		 * have all properties existing and set to default values
		 */
		createEmptySong: function() {
			return new can.Map({
				// basic properties obtained from connector
				artist: null,
				track: null,
				album: null,
				duration: null, // in seconds
				uniqueID: null,
				isPlaying: false,

				// more metadata loaded from L.FM API
				artistThumbUrl: null,

				// properties for internal use of background script
				internal: {
					tabId: -1,
					matchedConnector: null,
					attemptedLFMValidation: false,
					isLFMValid: false
				}
			});
		}

	};
});
