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
				// following are parsed values from connectors
				artist: null,
				track: null,
				album: null,
				currentTime: 0, // in seconds
				duration: null, // in seconds
				uniqueID: null,
				isPlaying: false,

				// data loaded from L.FM
				metadata: {
					artist: null,
					track: null,
					album: null,
					duration: null,
					albumThumbUrl: null,
					artistThumbUrl: null
				},

				// flags used by controller
				attemptedLFMValidation: false,
				isLFMValid: false
			});
		}

	};
});
