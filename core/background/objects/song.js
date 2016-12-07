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
	return function(parsedData, connector) {
		/**
		 * Number of seconds of playback before the track is scrobbled.
		 * This value is used only if no duration was parsed or loaded
		 */
		var DEFAULT_SCROBBLE_TIME = 30;

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
			currentTime: parsedData.currentTime || null,
			isPlaying: parsedData.isPlaying || false,
			trackArt: parsedData.trackArt || false,
			url: parsedData.url || null
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
			userloved: parsedData.userloved === 1,
			startTimestamp: Math.floor(Date.now() / 1000), // UTC timestamp in seconds
			url: parsed.url, // basic connector data
			connector: connector
		};

		/**
		 * Various flags
		 */
		var flags = {
			isProcessed: false, // has passed the pipeline
			isScrobbled: false,
			isCorrectedByUser: false, // user approved the data by either checking or entering it himself
			isLastfmValid: null, // don't know
			isMarkedAsPlaying: false // did we already show notification and mark as playing on L.FM?
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

		/**
		 * Returns total number of seconds of playback needed for this track to be scrobbled
		 */
		song.getSecondsToScrobble = function() {
			var max = 4 * 60; // really long tracks are scrobbled after 4 minutes
			var val = Math.max(this.getDuration() / 2, DEFAULT_SCROBBLE_TIME);
			return Math.min(val, max); // whatever occurs first
		};

		/**
		 * Return the track art associated with the song.
		 * @return {String|null}
		 */
		song.getTrackArt = function() {
			// prefer parsed art, fall back to metadata (last.fm or coverArtArchive art)
			return this.parsed.trackArt || this.metadata.artistThumbUrl || null;
		};

		return song;
	};
});
