'use strict';

/**
 * Base connector object.
 *
 * Provides properties and functions allow to get
 * track info from a website.
 *
 * @constructor
 */
function BaseConnector() {
	/**
	 * Selector of an element containing artist name.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.getArtist` is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.artistSelector = null;

	/**
	 * Selector of an element containing track name.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.getTrack` is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.trackSelector = null;

	/**
	 * Selector of an element containing album name.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.getAlbum` is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.albumSelector = null;

	/**
	 * Selector of an element containing the album artist.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.getAlbumArtist` is used.
	 *
	 * @type {String}
	 */
	this.albumArtistSelector = null;

	/**
	 * Selector of an element containing track current time in h:m:s format.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.getCurrentTime` is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.currentTimeSelector = null;

	/**
	 * Selector of an element containing track remaining time in h:m:s format.
	 *
	 * Note that the remaining time is not used directly, but is used for
	 * calculating current time or duration (it depends on what is missing
	 * on a website).
	 *
	 * Use this property if the website has either current time or duration.
	 * Do not override this property if the website contains both current time
	 * and duration.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.getRemainingTime` is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.remainingTimeSelector = null;

	/**
	 * Selector of an element containing track duration in h:m:s format.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.getDuration` is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.durationSelector = null;

	/**
	 * Selector of an element containing both current time and duration.
	 * `BaseConnector.currentTimeSelector` and `BaseConnector.durationSelector`
	 * properties have priority over this, and `BaseConnector.timeInfoSelector`
	 * is used only if any of the previous returns empty result.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.getTimeInfo` is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.timeInfoSelector = null;

	/**
	 * Selector of an element containing both artist and track name.
	 *
	 * `BaseConnector.artistSelector` and `BaseConnector.trackSelector`
	 * properties have priority over this,
	 * and `BaseConnector.artistTrackSelector` is used only if any of
	 * the previous returns empty result.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.getArtistTrack` is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.artistTrackSelector = null;

	/**
	 * Selector of a play button element. If the element is not visible,
	 * the playback is considered to be playing.
	 *
	 * Should not be used if Connector#pauseButtonSelector is defined.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.isPlaying` is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.playButtonSelector = null;

	/**
	 * Selector of a pause button element. If the element is visible,
	 * the playback is considered to be playing.
	 *
	 * Should not be used if `Connector.playButtonSelector` is defined.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.isPlaying` is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.pauseButtonSelector = null;

	/**
	 * Selector of a container closest to the player. Changes on this element
	 * will be observed and dispatched to `BaseConnector.onStateChanged`.
	 *
	 * Set this selector to use with default observing or
	 * set up some custom detection of player state changing.
	 *
	 * @type {String}
	 */
	this.playerSelector = null;

	/**
	 * Selector of element contains a track art of now playing song.
	 * Default implementation looks for track art URL in `src` attribute or
	 * `background-image` (`background`) CSS property of given element.
	 *
	 * Used for the notification service and "Now playing" popup.
	 *
	 * If not specified will fall back to Last.fm API.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.trackArtSelector = null;

	/**
	 * Priority of getters:
	 * 1) getters (`Connector.getArtist` etc.);
	 * 2) `Connector.getArtistTrack` and `Connector.getTimeInfo`;
	 * 3) `Connector.getTrackInfo`.
	 */

	/**
	 * Default implementation of artist name lookup by selector.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {String} Song artist
	 */
	this.getArtist = () => Util.getTextFromSelectors(this.artistSelector);

	/**
	 * Default implementation of track name lookup by selector.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {String} Song title
	 */
	this.getTrack = () => Util.getTextFromSelectors(this.trackSelector);

	/**
	 * Default implementation of album name lookup by selector.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {String} Song album
	 */
	this.getAlbum = () => Util.getTextFromSelectors(this.albumSelector);

	/**
	 * Default implementation of album artist name lookup by selector.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {String} Song album artist
	 */
	this.getAlbumArtist = () => Util.getTextFromSelectors(this.albumArtistSelector);

	/**
	 * Default implementation of track duration lookup. If this method returns
	 * an empty result, the track duration loaded from L.FM will be used.
	 *
	 * While it's not generally needed, override this method for more
	 * complex behaviour.
	 *
	 * @return {Number} Track length in seconds
	 */
	this.getDuration = () => {
		return Util.getSecondsFromSelectors(this.durationSelector);
	};

	/**
	 * Default implementation of track current time lookup by selector with
	 * some basic parsing.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {Number} Number of seconds passed from the beginning of the track
	 */
	this.getCurrentTime = () => {
		return Util.getSecondsFromSelectors(this.currentTimeSelector);
	};

	/**
	 * Default implementation of track remaining time lookup by selector with
	 * some basic parsing.
	 *
	 * Note that the remaining time is not used directly, but is used for
	 * calculating current time or duration (it depends on what is missing
	 * on a website).
	 *
	 * Use this property if the website has either current time or duration.
	 * Do not override this property if the website contains both current time
	 * and duration.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {Number} Number of remaining seconds
	 */
	this.getRemainingTime = () => {
		return Util.getSecondsFromSelectors(this.remainingTimeSelector);
	};

	/**
	 * Default implementation of current time and duration lookup by selector.
	 * This method is called only when `BaseConnector.getCurrentTime` and
	 * `BaseConnector.getDuration` return an empty result.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {Object} Object contains current time and duration info
	 */
	this.getTimeInfo = () => {
		return Util.splitTimeInfo(
			Util.getTextFromSelectors(this.timeInfoSelector)
		);
	};

	/**
	 * Default implementation of artist and track name lookup by selector.
	 * This method is called only when either `BaseConnector.getArtist` or
	 * `BaseConnector.getTrack` returns an empty result.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {Object} Object contain artist and track information
	 */
	this.getArtistTrack = () => {
		return Util.splitArtistTrack(
			Util.getTextFromSelectors(this.artistTrackSelector)
		);
	};

	/**
	 * Get object contains track info.
	 * See documentation of `defaultState` variable for supported properties.
	 *
	 * Use this function to get several properties
	 * from a single source per one call.
	 *
	 * @return {Object} Track info
	 */
	this.getTrackInfo = () => null;

	/**
	 * Returns a unique identifier of current track. The identifier does not
	 * have to be in any specific format. The uniqueness is only needed within
	 * the scope of the connector (values are internally namespaced by connector
	 * names).
	 *
	 * The value is used for storing the track metadata and reusing them later.
	 * Connectors which will implement this method will allow its users to store
	 * custom metadata where otherwise the track would be unrecognized.
	 *
	 * It is strongly recommended for connector authors to implement this method
	 * when possible.
	 *
	 * @return {String} Song unique ID
	 */
	this.getUniqueID = () => null;

	/**
	 * Default implementation of check for active playback by play/pause button
	 * selector. The state of playback allows the core to detect pauses.
	 *
	 * Override this method for custom behaviour.
	 *
	 * @return {Boolean} True if song is now playing; false otherwise
	 */
	this.isPlaying = () => {
		if (this.playButtonSelector) {
			return !Util.isElementVisible(this.playButtonSelector);
		}

		if (this.pauseButtonSelector) {
			return Util.isElementVisible(this.pauseButtonSelector);
		}

		/*
		 * Return true if play/pause button selector is not specified. It's
		 * better to assume the playback is always playing than otherwise. :)
		 */

		return true;
	};

	/**
	 * Default implementation to check whether a podcast is playing. Only has an
	 * effect if the user has opted to disable podcast scrobbling.
	 *
	 * @return {Boolean} True if the current track is a podcast; false otherwise
	 */
	this.isPodcast = () => false;

	/**
	 * Default implementation used to get the track art URL from the selector.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {String} Track art URL
	 */
	this.getTrackArt = () => {
		return Util.extractImageUrlFromSelectors(this.trackArtSelector);
	};

	/**
	 * Default implementation of a check if given track art URL
	 * equals default one. Default track arts are not used by the extension.
	 *
	 * Override this method to exclude default track arts.
	 *
	 * @param {String} trackArtUrl Track art URL
	 * @return {Boolean} Check result
	 */
	// eslint-disable-next-line no-unused-vars
	this.isTrackArtDefault = (trackArtUrl) => false;

	/**
	 * Default implementation of a check to see if a state change is allowed.
	 * MutationObserver will ignore mutations while this function returns false.
	 *
	 * Override this method to allow certain states to be ignored, for example
	 * if an advert is playing.
	 *
	 * @return {Boolean} True if state change is allowed; false otherwise
	 */
	this.isStateChangeAllowed = () => true;

	/**
	 * Default implementation of a check to see if a scrobbling is allowed.
	 * The connector resets current state if this function returns falsy result.
	 *
	 * Override this method to allow certain states to be reset.
	 *
	 * @return {Boolean} True if state change is allowed; false otherwise
	 */
	this.isScrobblingAllowed = () => true;

	/**
	 * Function that will be called when the connector is injected and
	 * the starter is configured to listen to state change.
	 *
	 * Override this method for more complex behaviour.
	 */
	this.onReady = () => { /* Do nothing */ };

	/**
	 * Called then injected script emits event.
	 * See `Connector.injectScript` for details.
	 *
	 * Override this method to get data from injected scripts.
	 *
	 * @param {Object} event Event object
	 */
	this.onScriptEvent = (event) => { // eslint-disable-line no-unused-vars
		// Do nothing
	};

	/**
	 * Connectors can use, but must not override functions
	 * and properties defined below.
	 */

	/**
	 * Add custom filter to default one. Use this method only to apply
	 * custom metadata filters.
	 *
	 * The given filter will be used first to make sure the default filter
	 * is executed after all other filters.
	 *
	 * @param {Object} filter Filter object
	 */
	this.applyFilter = (filter) => {
		metadataFilter = filter.extend(defaultFilter);
	};

	/**
 	 * Send request to core to reset current state. Should be used if connector
 	 * has custom state change listener.
 	 */
	this.resetState = () => {
		if (isStateReset) {
			return;
		}

		if (this.reactorCallback !== null) {
			this.reactorCallback({}, Object.keys(defaultState));
		}

		isStateReset = true;
	};

	/**
	 * Inject custom script into a page.
	 *
	 * Injected scripts communicate with content scripts
	 * using `window.postMessage` function.
	 *
	 * The format of message is following:
	 * {
	 * 	   // required fields
	 *	   sender: 'web-scrobbler',
	 *	   // optional fields used to exchange data
	 *	   foo: bar,
	 * 	   bar: baz,
	 * }
	 *
	 * @param {String} scriptFile Path to script file
	 */
	this.injectScript = (scriptFile) => {
		if (!window.webScrobblerScripts) {
			window.webScrobblerScripts = {};
		}

		if (window.webScrobblerScripts[scriptFile]) {
			return;
		}

		const scriptUrl = chrome.runtime.getURL(scriptFile);
		Util.injectScriptIntoDocument(scriptUrl);

		console.log(`Web Scrobbler: Injected ${scriptFile}`);

		window.addEventListener('message', (event) => {
			if (event.data.sender !== 'web-scrobbler') {
				return;
			}

			this.onScriptEvent(event);
		});


		window.webScrobblerScripts[scriptFile] = true;
	};

	/**
	 * Listener for the player state changes. Automatically detects the state,
	 * collects the track metadata and communicates with the background script
	 * if needed.
	 */
	this.onStateChanged = () => {
		if (!this.isStateChangeAllowed()) {
			return;
		}

		/**
		 * Because gathering the state from DOM is quite expensive and mutation
		 * events can be emitted REALLY often, we use throttle to set a minimum
		 * delay between two calls of the state change listener.
		 *
		 * Only exception is change in pause/play state which we detect
		 * immediately so we don't miss a quick play/pause/play or
		 * pause/play/pause sequence.
		 */
		const isPlaying = this.isPlaying();
		if (isPlaying !== currentState.isPlaying) {
			this.stateChangedWorker();
		} else {
			this.stateChangedWorkerThrottled();
		}
	};

	/**
	 * Enable support for MediaSession API.
	 *
	 * The connector will use MediaMetadata to get track info,
	 * if Media Session API is available, and MediaMetadata is filled.
	 */
	this.useMediaSessionApi = () => {
		isMediaSessionAllowed = 'mediaSession' in navigator;
	};

	/**
	 * Internal functions, state & API.
	 *
	 * Connectors must not call functions defined below.
	 * Connectors must not override functions and properties defined below.
	 */

	/**
	 * Default implementation for getting origin URL.
	 *
	 * @return {String} The source URL
	 */
	this.getOriginUrl = () => {
		return document.location.href;
	};

	const defaultFilter = MetadataFilter.createFilter(
		MetadataFilter.createFilterSetForFields(
			['artist', 'track', 'album', 'albumArtist'],
			[(text) => text.trim(), MetadataFilter.replaceNbsp]
		)
	);

	/**
	 * Filter object used to filter song metadata.
	 * @type {Object}
	 */
	let metadataFilter = defaultFilter;

	/**
	 * Default values of state properties.
	 * @type {Object}
	 */
	const defaultState = {
		/* Required fields */

		/**
		 * Track name.
		 * @type {String}
		 */
		track: null,

		/**
		 * Artist name.
		 * @type {String}
		 */
		artist: null,

		/* Optional fields */

		/**
 		 * Album name.
 		 * @type {String}
 		 */
		album: null,

		/**
		 * Album artist.
		 *
		 * @type {String}
		 */
		albumArtist: null,

		/**
		 * Track unique ID.
		 * @type {String}
		 */
		uniqueID: null,

		/**
		 * Track duration.
		 * @type {Number}
		 */
		duration: null,

		/**
		 * Current time.
		 * @type {Number}
		 */
		currentTime: null,

		/**
		 * Playing/pause state.
		 * @type {Boolean}
		 */
		isPlaying: true,

		/**
		 * URL to track art image.
		 * @type {String}
		 */
		trackArt: null,

		/**
		 * Whether the current track is a podcast episode.
		 * @type {String}
		 */
		isPodcast: false,

		/**
		 * Origin URL.
		 * @type {String}
		 */
		originUrl: null,
	};

	/* @ifdef DEVELOPMENT */
	/**
	 * List of song fields used to check if song is changed. If any of
	 * these fields are changed, the new song is playing.
	 * @type {Array}
	 */
	const fieldsToCheckSongChange = ['artist', 'track', 'album', 'albumArtist', 'uniqueID'];
	/* @endif */

	const mediaSessionFields = ['artist', 'track', 'album', 'trackArt'];
	const artistTrackFields = ['artist', 'track'];
	const timeInfoFields = ['duration', 'currentTime'];

	let isMediaSessionAllowed = false;

	/**
	 * Gathered info about the current track for internal use.
	 * @type {Object}
	 */
	const currentState = Object.assign({}, defaultState);

	/**
	 * Filtered info about the current track for internal use.
	 * @type {Object}
	 */
	const filteredState = Object.assign({}, defaultState);

	/**
	 * Flag indicates the current state is reset by the connector.
	 * Used to prevent spamming the controller by empty states.
	 *
	 * @type {Boolean}
	 */
	let isStateReset = false;

	/**
	 * Callback set by the reactor to listen on state changes of this connector.
	 *
	 * @type {Function}
	 */
	this.reactorCallback = null;

	/**
	 * Function for all the hard work around detecting and updating state.
	 */
	this.stateChangedWorker = () => {
		if (!this.isScrobblingAllowed()) {
			this.resetState();
			return;
		}

		isStateReset = false;

		const changedFields = [];
		const newState = this.getCurrentState();

		for (const key in currentState) {
			let newValue;
			if (newState[key] || newState[key] === false) {
				newValue = newState[key];
			} else {
				newValue = defaultState[key];
			}
			const oldValue = currentState[key];

			if (newValue !== oldValue) {
				currentState[key] = newValue;
				changedFields.push(key);
			}
		}

		if (changedFields.length > 0) {
			this.filterState(changedFields);

			if (this.reactorCallback !== null) {
				this.reactorCallback(filteredState, changedFields);
			}

			// @ifdef DEVELOPMENT
			if (changedFields.includes('isPlaying')) {
				Util.debugLog(`isPlaying state changed to ${newState.isPlaying}`);
			}

			for (const field of fieldsToCheckSongChange) {
				if (changedFields.includes(field)) {
					Util.debugLog(JSON.stringify(filteredState, null, 2));
					break;
				}
			}
			// @endif
		}
	};

	/**
	 * Get current state of connector.
	 * @return {Object} Current state
	 */
	this.getCurrentState = () => {
		const newState = {
			albumArtist: this.getAlbumArtist(),
			uniqueID: this.getUniqueID(),
			duration: this.getDuration(),
			currentTime: this.getCurrentTime(),
			isPlaying: this.isPlaying(),
			isPodcast: this.isPodcast(),
			originUrl: this.getOriginUrl(),
		};

		let mediaSessionInfo = null;
		if (isMediaSessionAllowed) {
			const { mediaSession } = navigator;
			mediaSessionInfo = Util.getMediaSessionInfo(mediaSession);
		}

		if (!mediaSessionInfo) {
			mediaSessionInfo = {
				trackArt: this.getTrackArt(),
				artist: this.getArtist(),
				track: this.getTrack(),
				album: this.getAlbum(),
			};
		}
		Util.fillEmptyFields(newState, mediaSessionInfo, mediaSessionFields);

		const remainingTime = Math.abs(this.getRemainingTime());
		if (remainingTime) {
			if (!newState.currentTime && newState.duration) {
				newState.currentTime = newState.duration - remainingTime;
			}

			if (!newState.duration && newState.currentTime) {
				newState.duration = newState.currentTime + remainingTime;
			}
		}

		const timeInfo = this.getTimeInfo();
		Util.fillEmptyFields(newState, timeInfo, timeInfoFields);

		const artistTrack = this.getArtistTrack();
		Util.fillEmptyFields(newState, artistTrack, artistTrackFields);

		const trackInfo = this.getTrackInfo();
		Util.fillEmptyFields(newState, trackInfo, Object.keys(defaultState));

		return newState;
	};

	/**
	 * Filter changed fields.
	 * @param {Array} changedFields List of changed fields
	 */
	this.filterState = (changedFields) => {
		for (const field of changedFields) {
			let fieldValue = currentState[field];

			switch (field) {
				case 'albumArtist': {
					if (fieldValue === currentState.artist) {
						fieldValue = defaultState[field];
					}
				}
				// eslint-disable-next-line no-fallthrough
				case 'artist':
				case 'track':
				case 'album': {
					fieldValue = metadataFilter.filterField(field, fieldValue) || defaultState[field];
					break;
				}
				case 'currentTime':
				case 'duration': {
					fieldValue = Util.escapeBadTimeValues(fieldValue) || defaultState[field];
					break;
				}
				case 'trackArt':
					if (fieldValue && this.isTrackArtDefault(fieldValue)) {
						fieldValue = null;
					}
					break;
			}

			filteredState[field] = fieldValue;
		}
	};

	/**
	 * Throttled call for state changed worker.
	 */
	this.stateChangedWorkerThrottled = Util.throttle(this.stateChangedWorker, 500);
}

// eslint-disable-next-line no-unused-vars
const Connector = window.Connector || new BaseConnector();
