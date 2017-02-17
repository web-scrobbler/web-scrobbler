'use strict';

/**
 * Song object
 */
define([
	'wrappers/can'
], function(can) {
	/**
	 * @constructor
	 * @param {Object} parsedData Current state received from connector
	 * @param {Object} connector Connector match object
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
			trackArt: parsedData.trackArt || false
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
			userloved: false,
			// UTC timestamp in seconds
			startTimestamp: Math.floor(Date.now() / 1000),
			connector: connector
		};

		/**
		 * Various flags
		 */
		var flags = {
			// Has song passed the pipeline
			isProcessed: false,
			isScrobbled: false,
			// User approved the data by either checking or entering it themself
			isCorrectedByUser: false,
			// Is song known by Last.fm
			isLastfmValid: null,
			// Did we already show notification and mark as playing on L.FM?
			isMarkedAsPlaying: false
		};

		var song = new can.Map({
			parsed: parsed,
			processed: processed,
			metadata: metadata,
			flags: flags
		});

		/**
		 * Get song artist.
		 * @return {String} Song artist
		 */
		song.getArtist = function() {
			return this.processed.artist || this.parsed.artist || null;
		};

		/**
		 * Get song title.
		 * @return {String} Song title
		 */
		song.getTrack = function() {
			return this.processed.track || this.parsed.track || null;
		};

		/**
		 * Get song album.
		 * @return {String} Song album
		 */
		song.getAlbum = function() {
			return this.processed.album || this.parsed.album || null;
		};

		/**
		 * Returns song's processed or parsed duration in seconds.
		 * Parsed duration (received from connector) is preferred.
		 * @return {Number} Song duration
		 */
		song.getDuration = function() {
			return this.parsed.duration || this.processed.duration || null;
		};

		/**
		 * Check if the song playback time is reaching its total duration.
		 * @return {Boolean} Check result
		 */
		song.isNearEnd = function() {
			// Last 5% of duration
			return (this.getDuration() !== null && this.parsed.currentTime >= Math.floor(this.getDuration() * 0.95));
		};

		/**
		 * Return total number of seconds of playback needed for this track
		 * to be scrobbled.
		 * @return {Number} Seconds to scrobble
		 */
		song.getSecondsToScrobble = function() {
			// Really long tracks are scrobbled after 4 minutes
			var max = 4 * 60;
			var val = Math.max(this.getDuration() / 2, DEFAULT_SCROBBLE_TIME);
			return Math.min(val, max); // whatever occurs first
		};

		/**
		 * Return the track art URL associated with the song.
		 * Parsed track art (received from connector) is preferred.
		 * @return {String} Track art URL
		 */
		song.getTrackArt = function() {
			return this.parsed.trackArt || this.metadata.artistThumbUrl || null;
		};

		song.getArtistTrackString = function() {
			return `${this.getArtist()} — ${this.getTrack()}`;
		};

		/**
		 * Set default song data.
		 */
		song.resetSongData = function() {
			this.attr('processed', processed);
			this.attr('metadata', metadata);

			this.flags.attr('isCorrectedByUser', false);
		};

		return song;
	};
});
