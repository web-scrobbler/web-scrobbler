'use strict';
/* globals _ */
/* exported Connector */

/**
 * Connector base object
 *
 * Handles all communication with the extension background script
 * and provides some convenient methods for parsing song data from the document
 *
 * @constructor
 */
var BaseConnector = window.BaseConnector || function () {

	/**
	 * Selector of an element containing artist name. The containing string will be filtered
	 * in the background script, if needed.
	 * Only applies when default implementation of {@link BaseConnector#getArtist} is used
	 *
	 * @type {string}
	 */
	this.artistSelector = null;

	/**
	 * Selector of an element containing track name. The containing string will be filtered
	 * in the background script, if needed.
	 * Only applies when default implementation of {@link BaseConnector#getTrack} is used
	 *
	 * @type {string}
	 */
	this.trackSelector = null;

	/**
	 * Selector of an element containing album name. The containing string will be filtered
	 * in the background script, if needed.
	 * Only applies when default implementation of {@link BaseConnector#getAlbum} is used
	 *
	 * @type {string}
	 */
	this.albumSelector = null;

	/**
	 * Selector of an element containing track current time in h:m:s format.
	 * Only applies when default implementation of {@link BaseConnector#getCurrentTime} is used
	 *
	 * @type {string}
	 */
	this.currentTimeSelector = null;

	/**
	 * Selector of an element containing track duration (total time) in h:m:s format.
	 * Only applies when default implementation of {@link BaseConnector#getDuration} is used
	 *
	 * @type {string}
	 */
	this.durationSelector = null;

	/**
	 * Selector of an element containing both artist and track name.
	 * {@link BaseConnector#artistSelector} and {@link BaseConnector#trackSelector} properties have priority over this,
	 * and {@link BaseConnector#artistTrackSelector} is used only if any of the previous returns empty result.
	 *
	 * The containing string will be filtered in the background script, if needed.
	 *
	 * Only applies when default implementation of {@link BaseConnector#getArtistTrack} is used
	 *
	 * @type {string}
	 */
	this.artistTrackSelector = null;

	/**
	 * Selector of an play button element. If the element is not visible, the playback is considered to be playing.
	 * Only applies when default implementation of {@link BaseConnector#isPlaying} is used
	 *
	 * @type {string}
	 */
	this.playButtonSelector = null;

	/**
	 * Selector of a container closest to the player. Changes on this element will be observed and
	 * dispatched to {@link BaseConnector#onStateChanged}
	 *
	 * Set this selector to use with default {@link MutationEvent} observing or set up some custom
	 * detection of player state changing
	 *
	 * @type {string}
	 */
	this.playerSelector = null;

	/**
	 * Selector of image used to represent the track being played. is used for
	 * the notification service.
	 *
	 * If not specified will fall back to last.fm API.
	 *
	 * @type {string}
	 */
	this.trackArtImageSelector = null;

	/**
	 * Default array of seperators.
	 *
	 * Push new seprators in the implementation if required.
	 *
		 * @type {array}
	 */
	this.separators = [' - ', ' – ', ' — ', '-', '–', '—', ':', '|', '///', ' . ', ' ~ '];

	/**
	 * Default implementation of artist name lookup by selector
	 *
	 * Override this method for more complex behaviour
	 *
	 * @returns {string|null}
	 */
	this.getArtist = function () {
		var text = $(this.artistSelector).text();
		return text || null;
	};

	/**
	 * Default implementation of track name lookup by selector
	 *
	 * Override this method for more complex behaviour
	 *
	 * @returns {string|null}
	 */
	this.getTrack = function () {
		var text = $(this.trackSelector).text();
		return text || null;
	};

	/**
	 * Default implementation of album name lookup by selector
	 *
	 * Override this method for more complex behaviour
	 *
	 * @returns {string|null}
	 */
	this.getAlbum = function () {
		var text = $(this.albumSelector).text();
		return text || null;
	};

	/**
	 * Default implementation of track duration lookup. If this method returns an empty result,
	 * the track duration loaded from L.FM will be used
	 *
	 * While it's not generally needed, override this method for more complex behaviour
	 *
	 * @returns {number|null} track length in seconds
	 */
	this.getDuration = function () {
		var text = $(this.durationSelector).text();
		return this.stringToSeconds(text);
	};

	/**
	 * Default implementation of track current time lookup by selector with some basic parsing
	 *
	 * Override this method for more complex behaviour
	 *
	 * @returns {number} number of seconds passed from the beginning of the track
	 */
	this.getCurrentTime = function () {
		var text = $(this.currentTimeSelector).text();
		return this.stringToSeconds(text);
	};

	/**
	 * Default implementation of artist and track name lookup by selector.
	 * This method is called only when either {@link BaseConnector#getArtist} or {@link BaseConnector#getTrack}
	 * returns an empty result
	 *
	 * Override this method for more complex behaviour
	 *
	 * @returns {{artist, track}}
	 */
	this.getArtistTrack = function () {
		var text = $(this.artistTrackSelector).text();
		var separator = this.findSeparator(text);

		var artist = null;
		var track = null;

		if (separator !== null) {
			artist = text.substr(0, separator.index);
			track = text.substr(separator.index + separator.length);
		}

		return {artist: artist, track: track};
	};

	/**
	 * Returns a unique identifier of current track. The identifier does not have to be in any specific format.
	 * The uniqueness is only needed within the scope of the connector (values are internally namespaced by connector
	 * names).
	 *
	 * The value is used for storing the track metadata and reusing them later. Connectors which will implement this
	 * method will allow its users to store custom metadata where otherwise the track would be unrecognized.
	 *
	 * It is strongly recommended for connector authors to implement this method when possible.
	 *
	 * @returns {String|null}
	 */
	this.getUniqueID = function () {
		return null;
	};

	/**
	 * Default implementation of check for active playback by play button selector.
	 * The state of playback allows the core to detect pauses.
	 *
	 * Returns TRUE as default when button selector is not specified. It's better to assume the playback
	 * is always playing than otherwise :)
	 *
	 * Override this method for custom behaviour
	 *
	 * @returns {Boolean}
	 */
	this.isPlaying = function () {
		return this.playButtonSelector === null || !$(this.playButtonSelector).is(':visible');
	};

	/**
	 * Default implementation used to get the track art from the trackArtImageSelector.
	 *
	 * Override this method for more complex behavor
	 * @return {String|null}
	 */
	this.getTrackArt = function () {
		return this.trackArtImageSelector === null ? null : $(this.trackArtImageSelector).attr('src');
	};

	/**
	 * Default implementation of a check to see if a state change is allowed.
	 *  MutationObserver will ignore mutations while this function returns false.
	 *
	 * Override this method to allow certain states to be ignored, for example if an advert is playing.
	 * @return {Boolean}
	 */
	this.isStateChangeAllowed = function () {
		return true;
	};

	/**
	 * Returns an array of PlaylistItem objects
	 * @return {{ startTime: Number, track: String | null, artist: String | null, artistTrack: String | null }}
	 */
	this.getPlaylist = function () {
		return null;
	};


	// --- state & api -------------------------------------------------------------------------------------------------


	/**
	 * Gathered info about the current track for internal use of base connector only.
	 */
	var currentState = {
		track: null,
		artist: null,
		album: null,
		uniqueID: null,
		duration: null,
		currentTime: 0,
		isPlaying: true
	};

	/**
	 * Callback set by the reactor to listen on state changes of this connector
	 *
	 * Custom connectors are NOT supposed to set this property
	 *
	 * @type {Function}
	 */
	this.reactorCallback = null;

	/**
	 * Function for all the hard work around detecting and updating state
	 */
	var stateChangedWorker = function () {
		var changedFields = [];
		var newTrack, newArtist, artistTrack, newAlbum, newDuration, newUID;
		newTrack = newArtist = artistTrack = newAlbum = newDuration = newUID = null;

		var newIsPlaying = this.isPlaying();
		if (newIsPlaying !== currentState.isPlaying) {
			currentState.isPlaying = newIsPlaying;
			changedFields.push('isPlaying');
		}

		var newTrackArt = this.getTrackArt();
		if (newTrackArt !== currentState.trackArt) {
			currentState.trackArt = newTrackArt;
			changedFields.push('trackArt');
		}

		var newCurrentTime = this.getCurrentTime();
		if (newCurrentTime !== currentState.currentTime) {
			currentState.currentTime = newCurrentTime;
			changedFields.push('currentTime');
		}

		this.currentPlaylist = this.getPlaylist();

		if(this.currentPlaylist) {
			/**
			 * This media is a collection of consecutive tracks.
			*/

			// Find out which track is playing
			var newPlaylistTrack = this.playlistIncrementCheck();
			if(newPlaylistTrack) {
				// (assuming that only track title data will be available...)
				// Make use of Artist - Album Name convention, as a default fallback
				artistTrack = this.getArtistTrack();
				if (newArtist === null || typeof newArtist === 'undefined') {
					newArtist = artistTrack.artist || newArtist;
				}
				if (newAlbum === null || typeof newAlbum === 'undefined') {
					newAlbum = artistTrack.track || newAlbum; // Format will probably be Artist - Album Name, so hijack it.
				}

				// Then look for track.artistTrack
				var newArtistTrack = newPlaylistTrack.artistTrack;
				var separator = this.findSeparator(newArtistTrack);
				if (separator !== null) {
					newArtist = newArtistTrack.substr(0, separator.index) || newArtist;
					newTrack = newArtistTrack.substr(separator.index + separator.length) || newTrack;
				}

				// Then, lastly, override with explicit track.track + track.artist
				newTrack = newPlaylistTrack.track || newTrack;
				newArtist = newPlaylistTrack.artist || newArtist;
				newAlbum = this.getAlbum() || newPlaylistTrack.album || newAlbum;

				var trackIndex = _.findIndex(this.currentPlaylist, function(someTrack) {
					return newPlaylistTrack.startTime === someTrack.startTime;
				});

				newDuration = newPlaylistTrack.duration ?
								newPlaylistTrack.duration
								: this.currentPlaylist[trackIndex+1] ? // Find time to next track
									this.currentPlaylist[trackIndex+1].startTime - newPlaylistTrack.startTime
									: ( this.getDuration() ? // If you can't, it must be the last track, sooo...
										this.getDuration() - newPlaylistTrack.startTime // Find time to end of whole media
										: 60 // or... if !duration, just wing it and give it 1 minute
									);

				// Append #NN (indexOf) to UID, to prevent scrobble issues due to repeated UID
				newUID = this.getUniqueID()+'#'+trackIndex;
			} else {
				console.info('Playlist parse error - Could not get the current track.');
			}
		} else {
			/**
			 * This media is a single track.
			*/
			newTrack = this.getTrack();

			newArtist = this.getArtist();

			artistTrack = this.getArtistTrack();
			if (newArtist === null && artistTrack.artist) {
				newArtist = artistTrack.artist;
			}
			if (newTrack === null && artistTrack.track) {
				newTrack = artistTrack.track;
			}

			newAlbum = this.getAlbum();

			newDuration = this.getDuration();

			newUID = this.getUniqueID();
		}

		if (newUID !== currentState.uniqueID) {
			currentState.uniqueID = newUID;
			changedFields.push('uniqueID');
		}

		if (newTrack !== currentState.track) {
			currentState.track = newTrack;
			changedFields.push('track');
		}

		if (newArtist !== currentState.artist) {
			currentState.artist = newArtist;
			changedFields.push('artist');
		}

		if (newAlbum !== currentState.album) {
			currentState.album = newAlbum;
			changedFields.push('album');
		}

		if (newDuration !== currentState.duration) {
			currentState.duration = newDuration;
			changedFields.push('duration');
		}

		// take action if needed
		if (changedFields.length > 0 && this.reactorCallback !== null) {
			this.reactorCallback(currentState, changedFields);
		}

	}.bind(this);

	/**
	 * Throttled call for state changed worker
	 */
	var stateChangedWorkerThrottled = _.throttle(stateChangedWorker, 500);

	/**
	 * Sets a new throttle delay in ms
	 */
	this.setThrottleInterval = function (delay) {
		stateChangedWorkerThrottled = _.throttle(stateChangedWorker, delay);
	}.bind(this);

	/**
	 * Listener for the player state changes. Automatically detects the state, collects the track metadata
	 * and communicates with the background script if needed.
	 *
	 * Connectors are NOT supposed to override this method
	 */
	this.onStateChanged = function () {
		/**
		 * Because gathering the state from DOM is quite expensive and mutation events can be emitted REALLY often,
		 * we use throttle to set a minimum delay between two calls of the state change listener.
		 *
		 * Only exception is change in pause/play state which we detect immediately so we don't miss
		 * a quick play/pause/play or pause/play/pause sequence
		 */
		var isPlaying = this.isPlaying();
		if (isPlaying != currentState.isPlaying) {
			stateChangedWorker();
		} else {
			stateChangedWorkerThrottled();
		}
	}.bind(this);

	/**
	 * Uses parsed playlist format from {@link BaseConnector#getPlaylist}
	 * Checks this.playlist against this.currentTime,
	 * and finds the track
	 *
	 * @returns {{artist, track}}
	 */
	this.playlistIncrementCheck = function() {
		var Connector = this;
		// Find first track in array that is at or before this.currentTime
		var playlist = Connector.currentPlaylist;
		var trackStack = _.sortBy(playlist, function(track) {
			return track.startTime;
		}).reverse();
		var newPlaylistTrack = _.find(trackStack, function(track) {
			return Connector.getCurrentTime() >= track.startTime;
		}) || null;

		// if you found one, update the track data
		if(newPlaylistTrack) {
			return {
				startTime: newPlaylistTrack.startTime,
				artist: newPlaylistTrack.artist,
				track: newPlaylistTrack.track,
				artistTrack: newPlaylistTrack.artistTrack,
				album: newPlaylistTrack.album,
				duration: newPlaylistTrack.duration
			};
		}
		return null;
	};

	/**
	 * Helper method to convert given time-string into seconds
	 *
	 * @param str time-string in h:m:s format
	 * @returns {number}
	 */
	this.stringToSeconds = function (str) {
		var s = str.toString().trim();
		var val, seconds = 0;

		for (var i = 0; i < 3; i++) {
			var idx = s.lastIndexOf(':');
			if (idx > -1) {
				val = parseInt(s.substr(idx + 1));
				seconds += val * Math.pow(60, i);
				s = s.substr(0, idx);
			} else {
				val = parseInt(s);
				seconds += val * Math.pow(60, i);
				break;
			}
		}

		return seconds || 0;
	};

	/**
	 * Find first occurence of possible separator in given string
	 * and return separator's position and size in chars or null.
	 *
	 * @returns {{index, length}|null}
	 */
	this.findSeparator = function (str) {
		if (typeof str === 'undefined' || str === null || str.length === 0) {
			return null;
		}

		for (var i in this.separators) {
			var sep = this.separators[i];
			var index = str.indexOf(sep);
			if (index > -1) {
				return { index: index, length: sep.length };
			}
		}

		return null;
	};

};

/**
 * Create object to be overridden in specific connector implementation
 * @type {BaseConnector}
 */
var Connector = new BaseConnector();
