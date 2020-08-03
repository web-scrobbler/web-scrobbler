/**
 * Base connector object.
 *
 * Provides properties and functions allow to get
 * track info from a website.
 *
 * @constructor
 */
declare function BaseConnector(): void;
declare class BaseConnector {
    /**
     * Selector of an element containing artist name.
     *
     * Only applies when default implementation of
     * `BaseConnector.getArtist` is used.
     *
     * @type {String|String[]}
     */
    artistSelector: string | string[];
    /**
     * Selector of an element containing track name.
     *
     * Only applies when default implementation of
     * `BaseConnector.getTrack` is used.
     *
     * @type {String|String[]}
     */
    trackSelector: string | string[];
    /**
     * Selector of an element containing album name.
     *
     * Only applies when default implementation of
     * `BaseConnector.getAlbum` is used.
     *
     * @type {String|String[]}
     */
    albumSelector: string | string[];
    /**
     * Selector of an element containing the album artist.
     *
     * Only applies when default implementation of
     * `BaseConnector.getAlbumArtist` is used.
     *
     * @type {String}
     */
    albumArtistSelector: string;
    /**
     * Selector of an element containing track current time in h:m:s format.
     *
     * Only applies when default implementation of
     * `BaseConnector.getCurrentTime` is used.
     *
     * @type {String|String[]}
     */
    currentTimeSelector: string | string[];
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
     * @type {String|String[]}
     */
    remainingTimeSelector: string | string[];
    /**
     * Selector of an element containing track duration in h:m:s format.
     *
     * Only applies when default implementation of
     * `BaseConnector.getDuration` is used.
     *
     * @type {String|String[]}
     */
    durationSelector: string | string[];
    /**
     * Selector of an element containing both current time and duration.
     * `BaseConnector.currentTimeSelector` and `BaseConnector.durationSelector`
     * properties have priority over this, and `BaseConnector.timeInfoSelector`
     * is used only if any of the previous returns empty result.
     *
     * Only applies when default implementation of
     * `BaseConnector.getTimeInfo` is used.
     *
     * @type {String|String[]}
     */
    timeInfoSelector: string | string[];
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
     * @type {String|String[]}
     */
    artistTrackSelector: string | string[];
    /**
     * Selector of a play button element. If the element is not visible,
     * the playback is considered to be playing.
     *
     * Should not be used if Connector#pauseButtonSelector is defined.
     *
     * Only applies when default implementation of
     * `BaseConnector.isPlaying` is used.
     *
     * @type {String|String[]}
     */
    playButtonSelector: string | string[];
    /**
     * Selector of a pause button element. If the element is visible,
     * the playback is considered to be playing.
     *
     * Should not be used if `Connector.playButtonSelector` is defined.
     *
     * Only applies when default implementation of
     * `BaseConnector.isPlaying` is used.
     *
     * @type {String|String[]}
     */
    pauseButtonSelector: string | string[];
    /**
     * Selector of a container closest to the player. Changes on this element
     * will be observed and dispatched to `BaseConnector.onStateChanged`.
     *
     * Set this selector to use with default observing or
     * set up some custom detection of player state changing.
     *
     * @type {String}
     */
    playerSelector: string;
    /**
     * Selector of element contains a track art of now playing song.
     * Default implmentation looks for track art URL in `src` attribute or
     * `background-image` (`background`) CSS property of given element.
     *
     * Used for the notification service and "Now playing" popup.
     *
     * If not specified will fall back to Last.fm API.
     *
     * @type {String|String[]}
     */
    trackArtSelector: string | string[];
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
    getArtist: () => string;
    /**
     * Default implementation of track name lookup by selector.
     *
     * Override this method for more complex behaviour.
     *
     * @return {String} Song title
     */
    getTrack: () => string;
    /**
     * Default implementation of album name lookup by selector.
     *
     * Override this method for more complex behaviour.
     *
     * @return {String} Song album
     */
    getAlbum: () => string;
    /**
     * Default implementation of album artist name lookup by selector.
     *
     * Override this method for more complex behaviour.
     *
     * @return {String} Song album artist
     */
    getAlbumArtist: () => string;
    /**
     * Default implementation of track duration lookup. If this method returns
     * an empty result, the track duration loaded from L.FM will be used.
     *
     * While it's not generally needed, override this method for more
     * complex behaviour.
     *
     * @return {Number} Track length in seconds
     */
    getDuration: () => number;
    /**
     * Default implementation of track current time lookup by selector with
     * some basic parsing.
     *
     * Override this method for more complex behaviour.
     *
     * @return {Number} Number of seconds passed from the beginning of the track
     */
    getCurrentTime: () => number;
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
    getRemainingTime: () => number;
    /**
     * Default implementation of current time and duration lookup by selector.
     * This method is called only when `BaseConnector.getCurrentTime` and
     * `BaseConnector.getDuration` return an empty result.
     *
     * Override this method for more complex behaviour.
     *
     * @return {Object} Object contains current time and duration info
     */
    getTimeInfo: () => any;
    /**
     * Default implementation of artist and track name lookup by selector.
     * This method is called only when either `BaseConnector.getArtist` or
     * `BaseConnector.getTrack` returns an empty result.
     *
     * Override this method for more complex behaviour.
     *
     * @return {Object} Object contain artist and track information
     */
    getArtistTrack: () => any;
    /**
     * Get object contains track info.
     * See documentation of `defaultState` variable for supported properties.
     *
     * Use this function to get several properties
     * from a single source per one call.
     *
     * @return {Object} Track info
     */
    getTrackInfo: () => any;
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
    getUniqueID: () => string;
    /**
     * Default implementation of check for active playback by play/pause button
     * selector. The state of playback allows the core to detect pauses.
     *
     * Override this method for custom behaviour.
     *
     * @return {Boolean} True if song is now playing; false otherwise
     */
    isPlaying: () => boolean;
    /**
     * Default implementation to check whether a podcast is playing. Only has an
     * effect if the user has opted to disable podcast scrobbling.
     *
     * @return {Boolean} True if the current track is a podcast; false otherwise
     */
    isPodcast: () => boolean;
    /**
     * Default implementation used to get the track art URL from the selector.
     *
     * Override this method for more complex behaviour.
     *
     * @return {String} Track art URL
     */
    getTrackArt: () => string;
    /**
     * Default implementation of a check if given track art URL
     * equals default one. Default track arts are not used by the extension.
     *
     * Override this method to exclude default track arts.
     *
     * @param {String} trackArtUrl Track art URL
     * @return {Boolean} Check result
     */
    isTrackArtDefault: (trackArtUrl: string) => boolean;
    /**
     * Default implementation of a check to see if a state change is allowed.
     * MutationObserver will ignore mutations while this function returns false.
     *
     * Override this method to allow certain states to be ignored, for example
     * if an advert is playing.
     *
     * @return {Boolean} True if state change is allowed; false otherwise
     */
    isStateChangeAllowed: () => boolean;
    /**
     * Default implementation of a check to see if a scrobbling is allowed.
     * The connector resets current state if this function returns falsy result.
     *
     * Override this method to allow certain states to be reset.
     *
     * @return {Boolean} True if state change is allowed; false otherwise
     */
    isScrobblingAllowed: () => boolean;
    /**
     * Function that will be called when the connector is injected and
     * the starter is configured to listen to state change.
     *
     * Override this method for more complex behaviour.
     */
    onReady: () => void;
    /**
     * Called then injected script emits event.
     * See `Connector.injectScript` for details.
     *
     * Override this method to get data from injected scripts.
     *
     * @param {Object} event Event object
     */
    onScriptEvent: (event: any) => void;
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
    applyFilter: (filter: any) => void;
    /**
     * Send request to core to reset current state. Should be used if connector
     * has custom state change listener.
     */
    resetState: () => void;
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
    injectScript: (scriptFile: string) => void;
    /**
     * Listener for the player state changes. Automatically detects the state,
     * collects the track metadata and communicates with the background script
     * if needed.
     */
    onStateChanged: () => void;
    /**
     * Enable support for MediaSession API.
     *
     * The connector will use MediaMetadata to get track info,
     * if Media Session API is available, and MediaMetadata is filled.
     */
    useMediaSessionApi: () => void;
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
    getOriginUrl: () => string;
    /**
     * Callback set by the reactor to listen on state changes of this connector.
     *
     * @type {Function}
     */
    reactorCallback: Function;
    /**
     * Function for all the hard work around detecting and updating state.
     */
    stateChangedWorker: () => void;
    /**
     * Get current state of connector.
     * @return {Object} Current state
     */
    getCurrentState: () => any;
    /**
     * Filter changed fields.
     * @param {Array} changedFields List of changed fields
     */
    filterState: (changedFields: any[]) => void;
    /**
     * Throttled call for state changed worker.
     */
    stateChangedWorkerThrottled: any;
}
declare const Connector: BaseConnector;
