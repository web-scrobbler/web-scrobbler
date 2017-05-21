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
		 * This value is used only if no duration was parsed or loaded.
		 */
		const DEFAULT_SCROBBLE_TIME = 30;

		/**
		 * Max number of seconds of playback before the track is scrobbled.
		 */
		const MAX_SCROBBLE_TIME = 240;

		/**
		 * Safe copy of initial parsed data.
		 * Should not be changed during lifetime of this object.
		 */
		const parsed = {
			artist: parsedData.artist,
			track: parsedData.track,
			album: parsedData.album,
			uniqueID: parsedData.uniqueID,
			duration: parsedData.duration,
			currentTime: parsedData.currentTime,
			isPlaying: parsedData.isPlaying,
			trackArt: parsedData.trackArt,
		};

		/**
		 * Post-processed song data, for example auto-corrected.
		 * Initially filled with parsed data and optionally changed
		 * as the object is processed in pipeline.
		 */
		const processed = {
			artist: parsed.artist,
			track: parsed.track,
			album: parsed.album,
			duration: parsed.duration
		};

		/**
		 * Various optional data.
		 */
		const metadata = {
			/**
			 * Flag indicates song is loved by used on service.
			 * @type {Boolean}
			 */
			userloved: false,
			/**
			 * Time when song is started playing in UNIX timestamp format.
			 * @type {Number}
			 */
			startTimestamp: Math.floor(Date.now() / 1000),
			/**
			 * Connector match object.
			 * @type {Object}
			 */
			connector
		};

		/**
		 * Various flags.
		 */
		const flags = {
			// Has song passed the pipeline
			/**
			 * Flag indicates song is processed by pipeline.
			 * @type {Boolean}
			 */
			isProcessed: false,
			/**
			 * Flag means song is scrobbled successfully.
			 * @type {Boolean}
			 */
			isScrobbled: false,
			/**
			 * Flag indicated song info is changed or approved by user.
			 * @type {Boolean}
			 */
			isCorrectedByUser: false,
			/**
			 * Flag indicated song is known by scrobbling service.
			 * @type {Boolean}
			 */
			isValid: false,
			/**
			 * Flag indicates song is marked as playing by controller.
			 * @type {Boolean}
			 */
			isMarkedAsPlaying: false,
			/**
			 * Flag means song is ignored by controller.
			 * @type {Boolean}
			 */
			isSkipped: false
		};

		const song = new can.Map({ parsed, processed, metadata,	flags });

		/**
		 * Get song artist.
		 * @return {String} Song artist
		 */
		song.getArtist = function() {
			return this.processed.artist || this.parsed.artist;
		};

		/**
		 * Get song title.
		 * @return {String} Song title
		 */
		song.getTrack = function() {
			return this.processed.track || this.parsed.track;
		};

		/**
		 * Get song album.
		 * @return {String} Song album
		 */
		song.getAlbum = function() {
			return this.processed.album || this.parsed.album;
		};

		/**
		 * Returns song's processed or parsed duration in seconds.
		 * Parsed duration (received from connector) is preferred.
		 * @return {Number} Song duration
		 */
		song.getDuration = function() {
			return this.parsed.duration || this.processed.duration;
		};

		/**
		 * Return total number of seconds of playback needed for this track
		 * to be scrobbled.
		 * @return {Number} Seconds to scrobble
		 */
		song.getSecondsToScrobble = function() {
			let val = Math.max(this.getDuration() / 2, DEFAULT_SCROBBLE_TIME);
			return Math.min(val, MAX_SCROBBLE_TIME);
		};

		/**
		 * Return the track art URL associated with the song.
		 * Parsed track art (received from connector) is preferred.
		 * @return {String} Track art URL
		 */
		song.getTrackArt = function() {
			return this.parsed.trackArt || this.metadata.artistThumbUrl || null;
		};

		/**
		 * Get formatted "Artist - Track" string. Return null if song is empty.
		 * @return {String} Formatted string
		 */
		song.getArtistTrackString = function() {
			if (this.isEmpty()) {
				return null;
			}
			return `${this.getArtist()} — ${this.getTrack()}`;
		};

		/**
		 * Check if song is empty. Empty song means it's missing
		 * either artist or track title.
		 * @return {Boolean} True if song is empty; false otherwise
		 */
		song.isEmpty = function() {
			return !(song.getArtist() && song.getTrack());
		};

		/**
		 * Check if song is vaild. The song means valid if it's known by
		 * scrobbler service or is corrected by the user.
		 * @return {Boolean} True if song is valid; false otherwise
		 */
		song.isValid = function() {
			return song.flags.isProcessed &&
				song.flags.isValid || song.flags.isCorrectedByUser;
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
