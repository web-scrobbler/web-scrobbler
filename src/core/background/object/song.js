'use strict';

/**
 * Song object.
 */
define((require) => {
	const MD5 = require('vendor/md5');
	const DeepProxy = require('object/deep-proxy');

	/**
	 * Default values of song flags.
	 */
	const DEFAULT_FLAGS = {
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
		isSkipped: false,
		/**
		 * Flag means song is replaying again.
		 * @type {Boolean}
		 */
		isReplaying: false,
	};

	/**
	 * Custom fields can be defined by user.
	 * @type {Array}
	 */
	const USER_FIELDS = ['artist', 'track', 'album'];

	/**
	 * Fields used to identify song.
	 * @type {Array}
	 */
	const BASE_FIELDS = ['artist', 'track', 'album'];

	/**
	 * Create new song object.
	 * @param  {Object} parsedData Current state received from connector
	 * @param  {Object} connector Connector match object
	 * @param  {Function} onChange Function is called on song data change
	 * @return {Object} Song instance
	 */
	function buildFrom(parsedData, connector, onChange) {
		let song = new Song(parsedData, connector);
		return DeepProxy.wrap(song, onChange);
	}

	/**
	 * Create unique song ID based on data parsed by connector.
	 * @param {Object} parsedData Current state received from connector
	 * @return {String} Unique ID
	 */
	function makeUniqueId(parsedData) {
		let inputStr = '';

		for (let field of BASE_FIELDS) {
			if (parsedData[field]) {
				inputStr += parsedData[field];
			}
		}
		if (inputStr) {
			return MD5(inputStr);
		}

		return null;
	}

	class Song {
		/**
		 * @constructor
		 * @param {Object} parsedData Current state received from connector
		 * @param {Object} connector Connector match object
		 */
		constructor(parsedData, connector) {
			/**
			 * Safe copy of initial parsed data.
			 * Must not be modified.
			 */
			this.parsed = Object.assign({}, parsedData);

			/**
			 * Post-processed song data, for example auto-corrected.
			 * Initially filled with parsed data and optionally changed
			 * as the object is processed in pipeline. Can be modified.
			 */
			this.processed = {
				// Filled by invoking Song.setDefaults function
			};

			/**
			 * Internal song ID based on data from connector. Used if
			 * `uniqueID` property is empty.
			 * @type {String}
			 */
			this.internalId = parsedData.uniqueID || makeUniqueId(parsedData);

			/**
			 * Various optional data. Can be modified.
			 */
			this.metadata = {
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
				 * Connector label.
				 * @type {String}
				 */
				label: connector.label,
			};

			/**
			 * Various flags. Can be modified.
			 */
			this.flags = {
				// Filled by invoking Song.setDefaults function
			};

			this.setDefaults();
		}

		/**
		 * Apply default song state (processed song info and song flags).
		 */
		setDefaults() {
			this.processed = {
				track: this.parsed.track,
				album: this.parsed.album,
				artist: this.parsed.artist,
				duration: this.parsed.duration,
			};

			this.flags = Object.assign({}, DEFAULT_FLAGS);
		}

		/**
		 * Get song artist.
		 *
		 * @return {String} Song artist
		 */
		getArtist() {
			return this.processed.artist || this.parsed.artist;
		}

		/**
		 * Get song title.
		 *
		 * @return {String} Song title
		 */
		getTrack() {
			return this.processed.track || this.parsed.track;
		}

		/**
		 * Get song album.
		 *
		 * @return {String} Song album
		 */
		getAlbum() {
			return this.processed.album || this.parsed.album;
		}

		/**
		 * Returns song's processed or parsed duration in seconds.
		 * Parsed duration (received from connector) is preferred.
		 *
		 * @return {Number} Song duration
		 */
		getDuration() {
			return this.parsed.duration || this.processed.duration;
		}

		/**
		 * Return the track art URL associated with the song.
		 * Parsed track art (received from connector) is preferred.
		 *
		 * @return {String} Track art URL
		 */
		getTrackArt() {
			return this.parsed.trackArt || this.metadata.artistThumbUrl || null;
		}

		/**
		 * Get formatted "Artist - Track" string. Return null if song is empty.
		 *
		 * @return {String} Formatted string
		 */
		getArtistTrackString() {
			if (this.isEmpty()) {
				return null;
			}
			return `${this.getArtist()} — ${this.getTrack()}`;
		}

		/**
		 * Get song unique ID.
		 *
		 * @return {String} Unique ID
		 */
		getUniqueId() {
			return this.internalId;
		}

		/**
		 * Get song source URL.
		 *
		 * @return {String} source URL.
		 */
		getOriginUrl() {
			return this.parsed.originUrl;
		}

		/**
		 * Check if song is empty. Empty song means it's missing
		 * either artist or track title.
		 *
		 * @return {Boolean} True if song is empty; false otherwise
		 */
		isEmpty() {
			return !(this.getArtist() && this.getTrack());
		}

		/**
		 * Check if song is valid. The song means valid if it's known by
		 * scrobbler service or is corrected by the user.
		 *
		 * @return {Boolean} True if song is valid; false otherwise
		 */
		isValid() {
			return this.flags.isProcessed && this.flags.isValid ||
				this.flags.isCorrectedByUser;
		}

		/**
		 * Set default song data.
		 */
		resetSongData() {
			this.setDefaults();
		}

		/**
		 * Set `Love` status of song.
		 *
		 * This function is supposed to be used by multiple scrobblers
		 * (services). Each service can have different value of `Love` flag;
		 * the behavior of the function is to set `Love` to true, if all
		 * services have the song with `Love` set to true.
		 *
		 * @param  {Boolean} isLoved Flag means song is loved or not
		 */
		setLoveStatus(isLoved) {
			if (isLoved !== undefined) {
				if (isLoved) {
					this.metadata.userloved = true;
				} else if (this.metadata.userloved) {
					this.metadata.userloved = false;
				}
			}
		}

		/**
		 * Get a string representing the song.
		 *
		 * @return {String} String representing the object.
		 */
		toString() {
			return JSON.stringify(this, null, 2);
		}

		/**
		 * Get song data to send it to different context.
		 *
		 * @return {Object} Object contain song data
		 */
		getCloneableData() {
			let fieldsToCopy = ['parsed', 'processed', 'metadata', 'flags'];
			let clonedSong = {};

			/*
			 * Firefox doesn't allow to send proxy objects via
			 * `browser.tabs.sendMessage` function. Since song properties
			 * are actually proxy objects, they should be converted
			 * to plain objects before sending.
			 */
			for (let field of fieldsToCopy) {
				clonedSong[field] = Object.assign({}, this[field]);
			}

			return clonedSong;
		}
	}

	return { buildFrom, BASE_FIELDS, USER_FIELDS };
});
