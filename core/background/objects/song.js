'use strict';

/**
 * Song object
 */
define([
	'wrappers/can'
], function(can) {
	/**
	 * @constructor
	 */
	return function(parsedData) {
		/**
		 * Safe copy of initial parsed data.
		 * Should not be changed during lifetime of this object
		 */
		var parsed = {
			artist: parsedData.artist || null,
			track: parsedData.track || null,
			album: parsedData.album || null,
			uniqueID: parsedData.uniqueID || null,
			duration: parsedData.duration || null,
			currentTime: parsedData.currentTime || null
		};

		/**
		 * Post-processed song data, for example auto-corrected.
		 * Initially filled with parsed data and optionally changed
		 * as the object is processed in pipeline
		 */
		var processed = {
			artist: parsed.artist,
			track: parsed.track,
			album: parsed.album,
			duration: parsed.duration
		};

		/**
		 * Various optional data
		 */
		var metadata = {
			startTimestamp: Math.floor(Date.now() / 1000) // UTC timestamp in seconds
		};

		/**
		 * Various flags
		 */
		var flags = {
			isProcessed: false, // has passed the pipeline
			isScrobbled: false,
			isLastfmValid: null // don't know
		};

		var song = new can.Map({
			parsed: parsed,
			processed: processed,
			metadata: metadata,
			flags: flags
		});

		/**
		 * Helper method
		 */
		song.getArtist = function() {
			return this.processed.artist || this.parsed.artist || null;
		};

		/**
		 * Helper method
		 */
		song.getTrack = function() {
			return this.processed.track || this.parsed.track || null;
		};

		/**
		 * Helper method
		 */
		song.getAlbum = function() {
			return this.processed.album || this.parsed.album || null;
		};

		/**
		 * Returns song's processed or parsed duration in seconds
		 */
		song.getDuration = function() {
			return this.processed.duration || this.parsed.duration || null;
		};

		/**
		 * Returns true if the song playback time is reaching its total duration
		 */
		song.isNearEnd = function() {
			return (this.getDuration() !== null && this.parsed.currentTime >= Math.floor(this.getDuration() * 0.95)); // last 5% of duration
		};

		return song;
	};
});
