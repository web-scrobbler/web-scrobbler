import * as MetadataFilter from '@web-scrobbler/metadata-filter';
import browser from 'webextension-polyfill';
import { ArtistTrackInfo, BaseState, State, TimeInfo } from '@/core/types';
import * as Util from '@/core/content/util';
import { ConnectorMeta } from '../connectors';

export default class BaseConnector {
	/**
	 * Meta of connector
	 */
	public meta: ConnectorMeta;

	/**
	 * Selector of an element containing artist name.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.getArtist` is used.
	 */
	public artistSelector: string | string[] | null = null;

	/**
	 * Selector of an element containing track name.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.getTrack` is used.
	 */
	public trackSelector: string | string[] | null = null;

	/**
	 * Selector of an element containing album name.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.getAlbum` is used.
	 */
	public albumSelector: string | string[] | null = null;

	/**
	 * Selector of an element containing the album artist.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.getAlbumArtist` is used.
	 */
	public albumArtistSelector: string | null = null;

	/**
	 * Selector of an element containing track current time in h:m:s format.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.getCurrentTime` is used.
	 */
	public currentTimeSelector: string | string[] | null = null;

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
	 */
	public remainingTimeSelector: string | string[] | null = null;

	/**
	 * Selector of an element containing track duration in h:m:s format.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.getDuration` is used.
	 */
	public durationSelector: string | string[] | null = null;

	/**
	 * Selector of an element containing both current time and duration.
	 * `BaseConnector.currentTimeSelector` and `BaseConnector.durationSelector`
	 * properties have priority over this, and `BaseConnector.timeInfoSelector`
	 * is used only if any of the previous returns empty result.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.getTimeInfo` is used.
	 */
	public timeInfoSelector: string | string[] | null = null;

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
	 */
	public artistTrackSelector: string | string[] | null = null;

	/**
	 * Selector of a play button element. If the element is not visible,
	 * the playback is considered to be playing.
	 *
	 * Should not be used if Connector#pauseButtonSelector is defined.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.isPlaying` is used.
	 */
	public playButtonSelector: string | string[] | null = null;

	/**
	 * Selector of a pause button element. If the element is visible,
	 * the playback is considered to be playing.
	 *
	 * Should not be used if `Connector.playButtonSelector` is defined.
	 *
	 * Only applies when default implementation of
	 * `BaseConnector.isPlaying` is used.
	 */
	public pauseButtonSelector: string | string[] | null = null;

	/**
	 * Selector of a container closest to the player. Changes on this element
	 * will be observed and dispatched to `BaseConnector.onStateChanged`.
	 *
	 * Set this selector to use with default observing or
	 * set up some custom detection of player state changing.
	 */
	public playerSelector: string | string[] | null = null;

	/**
	 * Selector of element contains a track art of now playing song.
	 * Default implementation looks for track art URL in `src` attribute or
	 * `background-image` (`background`) CSS property of given element.
	 *
	 * Used for the notification service and "Now playing" popup.
	 *
	 * If not specified will fall back to Last.fm API.
	 */
	public trackArtSelector: string | string[] | null = null;

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
	 * @returns Song artist
	 */
	public getArtist: () => string | null | undefined;

	/**
	 * Default implementation of track name lookup by selector.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @returns Song title
	 */
	public getTrack: () => string | null | undefined;

	/**
	 * Default implementation of album name lookup by selector.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @returns Song album
	 */
	public getAlbum: () => string | null | undefined;

	/**
	 * Default implementation of album artist name lookup by selector.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @returns Song album artist
	 */
	public getAlbumArtist: () => string | null | undefined;

	/**
	 * Default implementation of track duration lookup. If this method returns
	 * an empty result, the track duration loaded from L.FM will be used.
	 *
	 * While it's not generally needed, override this method for more
	 * complex behaviour.
	 *
	 * @returns Track length in seconds
	 */
	public getDuration: () => number | null | undefined;

	/**
	 * Default implementation of track current time lookup by selector with
	 * some basic parsing.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @returns Number of seconds passed from the beginning of the track
	 */
	public getCurrentTime: () => number | null | undefined;

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
	 * @returns Number of remaining seconds
	 */
	public getRemainingTime: () => number | null | undefined;

	/**
	 * Default implementation of current time and duration lookup by selector.
	 * This method is called only when `BaseConnector.getCurrentTime` and
	 * `BaseConnector.getDuration` return an empty result.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @returns Object containing current time and duration info
	 */
	public getTimeInfo: () => TimeInfo | null | undefined;

	/**
	 * Default implementation of artist and track name lookup by selector.
	 * This method is called only when either `BaseConnector.getArtist` or
	 * `BaseConnector.getTrack` returns an empty result.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @returns Object containing artist and track information
	 */
	public getArtistTrack: () => ArtistTrackInfo | null | undefined;

	/**
	 * Get object contains track info.
	 * See documentation of `defaultState` variable for supported properties.
	 *
	 * Use this function to get several properties
	 * from a single source per one call.
	 *
	 * @returns Track info
	 */
	public getTrackInfo: () => BaseState | null | undefined = () => null;

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
	 * @returns Song unique ID
	 */
	public getUniqueID: () => string | null | undefined = () => null;

	/**
	 * Default implementation of check for active playback by play/pause button
	 * selector. The state of playback allows the core to detect pauses.
	 *
	 * Override this method for custom behaviour.
	 *
	 * @returns True if song is now playing; false otherwise
	 */
	public isPlaying: () => boolean | null | undefined;

	/**
	 * Default implementation to check whether a podcast is playing. Only has an
	 * effect if the user has opted to disable podcast scrobbling.
	 *
	 * @returns True if the current track is a podcast; false otherwise
	 */
	public isPodcast: () => boolean | null = () => false;

	/**
	 * Default implementation used to get the track art URL from the selector.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @returns Track art URL
	 */
	public getTrackArt: () => string | null | undefined;

	/**
	 * Default implementation of a check if given track art URL
	 * equals default one. Default track arts are not used by the extension.
	 *
	 * Override this method to exclude default track arts.
	 *
	 * @param trackArtUrl - Track art URL
	 * @returns Check result
	 */
	public isTrackArtDefault: (
		trackArtUrl?: string | null | undefined
	) => boolean | null | undefined = () => false;

	/**
	 * Default implementation of a check to see if a state change is allowed.
	 * MutationObserver will ignore mutations while this function returns false.
	 *
	 * Override this method to allow certain states to be ignored, for example
	 * if an advert is playing.
	 *
	 * @returns True if state change is allowed; false otherwise
	 */
	public isStateChangeAllowed: () => boolean | null | undefined = () => true;

	/**
	 * Default implementation of a check to see if a scrobbling is allowed.
	 * The connector resets current state if this function returns falsy result.
	 *
	 * Override this method to allow certain states to be reset.
	 *
	 * @returns True if state change is allowed; false otherwise
	 */
	public isScrobblingAllowed: () => boolean | null | undefined = () => true;

	/**
	 * Function that will be called when the connector is injected and
	 * the starter is configured to listen to state change.
	 *
	 * Override this method for more complex behaviour.
	 */
	public onReady: () => void = () => {
		// Do nothing by default
	};

	/**
	 * Called then injected script emits event.
	 * See `Connector.injectScript` for details.
	 *
	 * Override this method to get data from injected scripts.
	 *
	 * @param event - Event object
	 */
	public onScriptEvent: (
		event: MessageEvent<Record<string, unknown>>
	) => void = () => {
		// Do nothing
	};

	/**
	 * Default metadata filter to be used if none other is specified
	 */
	private defaultFilter = MetadataFilter.createFilter(
		MetadataFilter.createFilterSetForFields(
			['artist', 'track', 'album', 'albumArtist'],
			[(text) => text.trim(), MetadataFilter.replaceNbsp]
		)
	);

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
	 * @param filter - Filter object
	 */
	public applyFilter: (filter: MetadataFilter.MetadataFilter) => void;

	/**
	 * Send request to core to reset current state. Should be used if connector
	 * has custom state change listener.
	 */
	public resetState: () => void;

	/**
	 * Inject custom script into a page.
	 *
	 * Injected scripts communicate with content scripts
	 * using `window.postMessage` function.
	 *
	 * The format of message is following:
	 * \{
	 * 	   // required fields
	 *	   sender: 'web-scrobbler',
	 *	   // optional fields used to exchange data
	 *	   foo: bar,
	 * 	   bar: baz,
	 * \}
	 *
	 * @param scriptFile - Path to script file
	 */
	public injectScript: (scriptFile: string) => void = (scriptFile) => {
		if (!window.webScrobblerScripts) {
			window.webScrobblerScripts = {};
		}

		if (window.webScrobblerScripts[scriptFile]) {
			return;
		}

		const scriptUrl = browser.runtime.getURL(scriptFile);
		Util.injectScriptIntoDocument(scriptUrl);

		Util.debugLog(`Injected ${scriptFile}`);

		window.addEventListener(
			'message',
			(event: MessageEvent<Record<string, unknown>>) => {
				if (
					typeof event.data !== 'object' ||
					!('sender' in event.data) ||
					event.data.sender !== 'web-scrobbler'
				) {
					return;
				}

				this.onScriptEvent(event);
			}
		);

		window.webScrobblerScripts[scriptFile] = true;
	};

	/**
	 * Listener for the player state changes. Automatically detects the state,
	 * collects the track metadata and communicates with the background script
	 * if needed.
	 */
	public onStateChanged: () => void;

	/**
	 * Enable support for MediaSession API.
	 *
	 * The connector will use MediaMetadata to get track info,
	 * if Media Session API is available, and MediaMetadata is filled.
	 */
	public useMediaSessionApi: () => void = () => {
		this.isMediaSessionAllowed = 'mediaSession' in navigator;
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
	 * @returns The source URL
	 */
	public getOriginUrl: () => string | null | undefined = () => {
		return document.location.href;
	};

	/**
	 * Boolean flag that indicates whether MediaSession API is supported.
	 * This flag is set to true if connector calls `useMediaSessionApi` method.
	 * Otherwise, it is set to false.
	 */
	private isMediaSessionAllowed = false;

	/**
	 * Filter object used to filter song metadata.
	 */
	private metadataFilter = this.defaultFilter;

	/**
	 * Default values of state properties.
	 */
	private defaultState: State = {
		track: null,
		artist: null,
		album: null,
		albumArtist: null,
		uniqueID: null,
		duration: null,
		currentTime: null,
		isPlaying: true,
		trackArt: null,
		isPodcast: false,
		originUrl: null,
	};

	// #v-ifdef VITE_DEV
	/**
	 * List of song fields used to check if song is changed. If any of
	 * these fields are changed, the new song is playing.
	 */
	private fieldsToCheckSongChange: (keyof State)[] = [
		'artist',
		'track',
		'album',
		'albumArtist',
		'uniqueID',
	];
	// #v-endif
	private mediaSessionFields: (keyof State)[] = [
		'artist',
		'track',
		'album',
		'trackArt',
	];
	private artistTrackFields: (keyof State)[] = ['artist', 'track'];
	private timeInfoFields: (keyof State)[] = ['duration', 'currentTime'];

	/**
	 * Gathered info about the current track for internal use.
	 */
	private currentState = Object.assign({}, this.defaultState);

	/**
	 * Filtered info about the current track for internal use.
	 */
	private filteredState = Object.assign({}, this.defaultState);

	/**
	 * Flag indicates the current state is reset by the connector.
	 * Used to prevent spamming the controller by empty states.
	 */
	private isStateReset = false;

	/**
	 * Callback set by the controller to listen on state changes of this connector.
	 */
	public controllerCallback:
		| ((state: State, fields: (keyof State)[]) => void)
		| null = null;

	/**
	 * Function for all the hard work around detecting and updating state.
	 */
	private stateChangedWorker: () => void;

	/**
	 * Get current state of connector.
	 * @returns Current state
	 */
	private getCurrentState: () => State;

	/**
	 * Filter changed fields.
	 * @param changedFields - List of changed fields
	 */
	private filterState: (changedFields: (keyof State)[]) => void;

	/**
	 * Throttled call for state changed worker.
	 */
	private stateChangedWorkerThrottled: () => void;

	constructor(meta: ConnectorMeta) {
		this.meta = meta;

		this.getArtist = () => Util.getTextFromSelectors(this.artistSelector);

		this.getTrack = () => Util.getTextFromSelectors(this.trackSelector);

		this.getAlbum = () => Util.getTextFromSelectors(this.albumSelector);

		this.getAlbumArtist = () =>
			Util.getTextFromSelectors(this.albumArtistSelector);

		this.getDuration = () => {
			return Util.getSecondsFromSelectors(this.durationSelector);
		};

		this.getCurrentTime = () => {
			return Util.getSecondsFromSelectors(this.currentTimeSelector);
		};

		this.getRemainingTime = () => {
			return Util.getSecondsFromSelectors(this.remainingTimeSelector);
		};

		this.getTimeInfo = () => {
			return Util.splitTimeInfo(
				Util.getTextFromSelectors(this.timeInfoSelector)
			);
		};

		this.getArtistTrack = () => {
			return Util.splitArtistTrack(
				Util.getTextFromSelectors(this.artistTrackSelector)
			);
		};

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

		this.getTrackArt = () => {
			return Util.extractImageUrlFromSelectors(this.trackArtSelector);
		};

		this.applyFilter = (filter) => {
			this.metadataFilter = filter.extend(this.defaultFilter);
		};

		this.resetState = () => {
			if (this.isStateReset) {
				return;
			}

			if (this.controllerCallback !== null) {
				this.controllerCallback(
					{},
					Object.keys(this.defaultState) as (keyof State)[]
				);
			}

			this.isStateReset = true;
		};

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
			if (isPlaying !== this.currentState.isPlaying) {
				this.stateChangedWorker();
			} else {
				this.stateChangedWorkerThrottled();
			}
		};

		this.stateChangedWorker = () => {
			if (!this.isScrobblingAllowed()) {
				this.resetState();
				return;
			}

			this.isStateReset = false;

			const changedFields: (keyof State)[] = [];
			const newState = this.getCurrentState();

			for (const keyRaw in this.currentState) {
				let newValue;
				const key = keyRaw as keyof State;
				if (newState[key] || newState[key] === false) {
					newValue = newState[key];
				} else {
					newValue = this.defaultState[key];
				}
				const oldValue = this.currentState[key];

				if (newValue !== oldValue) {
					// @ts-expect-error - TS is a bit confused by the optionality of the fields
					this.currentState[key] = newValue;
					changedFields.push(key);
				}
			}

			if (changedFields.length > 0) {
				this.filterState(changedFields);

				if (this.controllerCallback !== null) {
					this.controllerCallback(this.filteredState, changedFields);
				}

				// #v-ifdef VITE_DEV
				if (changedFields.includes('isPlaying')) {
					Util.debugLog(
						`isPlaying state changed to ${
							newState.isPlaying?.toString() ?? 'undefined'
						}`
					);
				}

				for (const field of this.fieldsToCheckSongChange) {
					if (changedFields.includes(field)) {
						Util.debugLog(
							JSON.stringify(this.filteredState, null, 2)
						);
						break;
					}
				}
				// #v-endif
			}
		};

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
			if (this.isMediaSessionAllowed) {
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
			Util.fillEmptyFields(
				newState,
				mediaSessionInfo,
				this.mediaSessionFields
			);

			const remainingTime = Math.abs(this.getRemainingTime() ?? 0);
			if (remainingTime) {
				if (!newState.currentTime && newState.duration) {
					newState.currentTime = newState.duration - remainingTime;
				}

				if (!newState.duration && newState.currentTime) {
					newState.duration = newState.currentTime + remainingTime;
				}
			}

			const timeInfo = this.getTimeInfo();
			Util.fillEmptyFields(newState, timeInfo, this.timeInfoFields);

			const artistTrack = this.getArtistTrack();
			Util.fillEmptyFields(newState, artistTrack, this.artistTrackFields);

			const trackInfo = this.getTrackInfo();
			if (trackInfo !== null) {
				Util.fillEmptyFields(
					newState,
					trackInfo,
					Object.keys(this.defaultState) as (keyof State)[]
				);
			}

			return newState;
		};

		/**
		 * Filter changed fields.
		 * @param changedFields - List of changed fields
		 */
		this.filterState = (changedFields) => {
			for (const field of changedFields) {
				let fieldValue = this.currentState[field];

				switch (field) {
					case 'albumArtist': {
						if (fieldValue === this.currentState.artist) {
							fieldValue = this.defaultState[field];
						}
					}
					// eslint-disable-next-line no-fallthrough
					case 'artist':
					case 'track':
					case 'album': {
						if (fieldValue === null || fieldValue === undefined) {
							fieldValue = this.defaultState[field];
							break;
						}
						fieldValue =
							this.metadataFilter.filterField(
								field,
								fieldValue as string
							) || this.defaultState[field];
						break;
					}
					case 'currentTime':
					case 'duration': {
						if (fieldValue === null || fieldValue === undefined) {
							fieldValue = this.defaultState[field];
							break;
						}
						fieldValue =
							Util.escapeBadTimeValues(fieldValue as number) ||
							this.defaultState[field];
						break;
					}
					case 'trackArt':
						if (
							fieldValue &&
							this.isTrackArtDefault(fieldValue as string)
						) {
							fieldValue = null;
						}
						break;
				}

				// @ts-expect-error - TS is a bit confused by the optionality of the fields
				this.filteredState[field] = fieldValue;
			}
		};

		this.stateChangedWorkerThrottled = Util.throttle(
			this.stateChangedWorker,
			500
		);
	}
}
