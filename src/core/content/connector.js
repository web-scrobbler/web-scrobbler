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
	 * {@link BaseConnector#getArtist} is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.artistSelector = null;

	/**
	 * Selector of an element containing track name.
	 *
	 * Only applies when default implementation of
	 * {@link BaseConnector#getTrack} is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.trackSelector = null;

	/**
	 * Selector of an element containing album name.
	 *
	 * Only applies when default implementation of
	 * {@link BaseConnector#getAlbum} is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.albumSelector = null;

	/**
	 * Selector of an element containing track current time in h:m:s format.
	 *
	 * Only applies when default implementation of
	 * {@link BaseConnector#getCurrentTime} is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.currentTimeSelector = null;

	/**
	 * Selector of an element containing track remaining time in h:m:s format.
	 *
	 * Only applies when default implementation of
	 * {@link BaseConnector#getRemainingTime} is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.remainingTimeSelector = null;

	/**
	 * Selector of an element containing track duration in h:m:s format.
	 *
	 * Only applies when default implementation of
	 * {@link BaseConnector#getDuration} is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.durationSelector = null;

	/**
	 * Selector of an element containing both current time and duration.
	 * {@link BaseConnector#currentTimeSelector} and {@link BaseConnector#durationSelector}
	 * properties have priority over this, and {@link BaseConnector#timeInfoSelector}
	 * is used only if any of the previous returns empty result.
	 *
	 * Only applies when default implementation of {@link BaseConnector#getTimeInfo} is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.timeInfoSelector = null;

	/**
	 * Selector of an element containing both artist and track name.
	 * {@link BaseConnector#artistSelector} and
	 * {@link BaseConnector#trackSelector} properties have priority over this,
	 * and {@link BaseConnector#artistTrackSelector} is used only if any of
	 * the previous returns empty result.
	 *
	 * Only applies when default implementation of
	 * {@link BaseConnector#getArtistTrack} is used.
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
	 * {@link BaseConnector#isPlaying} is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.playButtonSelector = null;

	/**
	 * Selector of a pause button element. If the element is visible,
	 * the playback is considered to be playing.
	 *
	 * Should not be used if Connector#playButtonSelector is defined.
	 *
	 * Only applies when default implementation of
	 * {@link BaseConnector#isPlaying} is used.
	 *
	 * @type {String}
	 * @type {Array}
	 */
	this.pauseButtonSelector = null;

	/**
	 * Selector of a container closest to the player. Changes on this element
	 * will be observed and dispatched to {@link BaseConnector#onStateChanged}.
	 *
	 * Set this selector to use with default {@link MutationEvent} observing or
	 * set up some custom detection of player state changing.
	 *
	 * @type {String}
	 */
	this.playerSelector = null;

	/**
	 * Selector of element contains a track art of now playing song.
	 * Default implmentation looks for track art URL in 'src' attribute or
	 * 'background-image' ('background') CSS property of given element.
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
	 * Default implementation of track duration lookup. If this method returns
	 * an empty result, the track duration loaded from L.FM will be used.
	 *
	 * While it's not generally needed, override this method for more
	 * complex behaviour.
	 *
	 * @return {Number} Track length in seconds
	 */
	this.getDuration = () => {
		return Util.stringToSeconds(
			Util.getTextFromSelectors(this.durationSelector)
		);
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
		return Util.stringToSeconds(
			Util.getTextFromSelectors(this.currentTimeSelector)
		);
	};

	/**
	 * Default implementation of track remaining time lookup by selector with
	 * some basic parsing.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {Number} Number of remaining seconds
	 */
	this.getRemainingTime = () => {
		return Util.stringToSeconds(
			Util.getTextFromSelectors(this.remainingTimeSelector)
		);
	};

	/**
	 * Default implementation of current time and duration lookup by selector.
	 * This method is called only when {@link BaseConnector#getCurrentTime} and
	 * {@link BaseConnector#getDuration} return an empty result.
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
	 * This method is called only when either {@link BaseConnector#getArtist} or
	 * {@link BaseConnector#getTrack} returns an empty result.
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
	 * Default implementation of check for active playback by play button
	 * selector. The state of playback allows the core to detect pauses.
	 *
	 * Override this method for custom behaviour.
	 *
	 * @return {Boolean} True if song is now playing; false otherwise
	 */
	this.isPlaying = () => {
		if (this.playButtonSelector) {
			const playButton = Util.queryElements(this.playButtonSelector);
			if (playButton) {
				return !playButton.is(':visible');
			}

			return false;
		}

		if (this.pauseButtonSelector) {
			const pauseButton = Util.queryElements(this.pauseButtonSelector);
			if (pauseButton) {
				return pauseButton.is(':visible');
			}

			return false;
		}

		/*
		 * Return true if play/pause button selector is not specified. It's
		 * better to assume the playback is always playing than otherwise. :)
		 */

		return true;
	};

	/**
	 * Get current state of connector. Used to get all info per one call.
	 * See documentation of 'defaultState' variable for supported properties.
	 * @return {Object} Current state
	 */
	this.getCurrentState = () => {
		let newState = {
			track: this.getTrack(),
			artist: this.getArtist(),
			album: this.getAlbum(),
			uniqueID: this.getUniqueID(),
			duration: this.getDuration(),
			currentTime: this.getCurrentTime(),
			isPlaying: this.isPlaying(),
			trackArt: this.getTrackArt(),
			originUrl: this.getOriginUrl(),
		};

		let artistTrack = this.getArtistTrack() || Util.makeEmptyArtistTrack();
		if (!newState.artist && artistTrack.artist) {
			newState.artist = artistTrack.artist;
		}
		if (!newState.track && artistTrack.track) {
			newState.track = artistTrack.track;
		}

		if (!newState.currentTime) {
			let remainingTime = this.getRemainingTime();
			if (remainingTime && newState.duration) {
				newState.currentTime = newState.duration - Math.abs(remainingTime);
			}
		}

		let timeInfo = this.getTimeInfo();
		if (!newState.duration && timeInfo.duration) {
			newState.duration = timeInfo.duration;
		}
		if (!newState.currentTime && timeInfo.currentTime) {
			newState.currentTime = timeInfo.currentTime;
		}

		return newState;
	};

	/**
	 * Default implementation used to get the track art URL from the selector.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {String} Track art URL
	 */
	this.getTrackArt = () => {
		const element = Util.queryElements(this.trackArtSelector);
		if (!element) {
			return null;
		}

		let trackArtUrl = element.attr('src');
		if (!trackArtUrl) {
			let cssProperties = ['background-image', 'background'];
			for (let property of cssProperties) {
				let propertyValue = element.css(property);
				if (propertyValue) {
					trackArtUrl = Util.extractUrlFromCssProperty(propertyValue);
				}
			}
		}

		return Util.normalizeUrl(trackArtUrl);
	};

	/**
	 * Check if given track art URL equals default one.
	 * Default track arts are not used by the extension.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @param  {String} trackArtUrl Track art URL
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
	 * @param {Object} event Event object
	 */
	this.onScriptEvent = (event) => { // eslint-disable-line
		// Do nothing
	};

	/**
	 * Connectors must not override functions and properties defined below.
	 */

	/**
	 * Add custom filter to default one. Use this method only to apply
	 * custom metadata filters.
	 *
	 * The given filter will be used first to make sure the default filter
	 * is executed after all other filters.
	 *
	 * @param  {Object} filter Filter object
	 */
	this.applyFilter = (filter) => {
		metadataFilter = filter.extend(MetadataFilter.getDefaultFilter());
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
	 * @param  {String} scriptFile Path to script file
	 */
	this.injectScript = (scriptFile) => {
		if (!window.webScrobblerScripts) {
			window.webScrobblerScripts = {};
		}

		if (window.webScrobblerScripts[scriptFile]) {
			return;
		}

		let scriptUrl = browser.runtime.getURL(scriptFile);
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
		let isPlaying = this.isPlaying();
		if (isPlaying !== currentState.isPlaying) {
			// @ifdef DEBUG
			Util.debugLog(`isPlaying state changed to ${isPlaying}`);
			// @endif
			this.stateChangedWorker();
		} else {
			this.stateChangedWorkerThrottled();
		}
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

	/**
	 * Filter object used to filter song metadata.
	 *
	 * @see {@link MetadataFilter}
	 * @type {Object}
	 */
	let metadataFilter = MetadataFilter.getDefaultFilter();

	/**
	 * Default values of state properties.
	 * @type {Object}
	 */
	const defaultState = {
		// Required fields.
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

		// Optional fields.
		/**
 		 * Album name.
 		 * @type {String}
 		 */
		album: null,
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
		trackArt: null
	};

	// @ifdef DEBUG
	/**
	 * List of song fields used to check if song is changed. If any of
	 * these fields are changed, the new song is playing.
	 * @type {Array}
	 */
	const fieldsToCheckSongChange = ['artist', 'track', 'album', 'uniqueID'];
	// @endif

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

		let changedFields = [];
		let newState = this.getCurrentState();

		for (let key in currentState) {
			let newValue;
			if (newState[key] || newState[key] === false) {
				newValue = newState[key];
			} else {
				newValue = defaultState[key];
			}
			let oldValue = currentState[key];

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

			// @ifdef DEBUG
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
	 * Filter changed fields.
	 * @param  {Array} changedFields List of changed fields
	 */
	this.filterState = (changedFields) => {
		for (let field of changedFields) {
			let fieldValue = currentState[field];

			switch (field) {
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
					if (this.isTrackArtDefault(fieldValue)) {
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

// eslint-disable-next-line
const Connector = window.Connector || new BaseConnector();
