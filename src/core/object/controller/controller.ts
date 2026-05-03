import type { ConnectorMeta } from '@/core/connectors';
import * as Options from '@/core/storage/options';
import type { DebugLogType } from '@/util/util';
import {
	areAllResults,
	parseScrobblePercent,
	getSecondsToScrobble,
	isAnyResult,
} from '@/util/util';
import Song from '@/core/object/song';
import Timer from '@/core/object/timer';
import Pipeline from '@/core/object/pipeline/pipeline';
import * as ControllerMode from '@/core/object/controller/controller-mode';
import * as ControllerEvents from '@/core/object/controller/controller-event';
import { ServiceCallResult } from '@/core/object/service-call-result';
import SavedEdits from '@/core/storage/saved-edits';
import type { State } from '@/core/types';
import {
	contentListener,
	sendContentMessage,
	setupContentListeners,
} from '@/util/communication';
import EventEmitter from '@/util/emitter';
import * as BrowserStorage from '@/core/storage/browser-storage';
import { debugLog } from '@/core/content/util';
import scrobbleCache from '@/core/storage/scrobble-cache';
import { ScrobbleStatus } from '@/core/storage/wrapper';
import browser from 'webextension-polyfill';
import type BaseConnector from '@/core/content/connector';
import Blocklist from '@/core/storage/blocklist';

/**
 * List of song fields used to check if song is changed. If any of
 * these fields are changed, the new song is playing.
 */
const fieldsToCheckSongChange = ['artist', 'track', 'album', 'uniqueID'];

export type ControllerEvent =
	(typeof ControllerEvents)[keyof typeof ControllerEvents];

export type ControllerModeStr =
	(typeof ControllerMode)[keyof typeof ControllerMode];

/**
 * Priorities of each state as an object
 */
export const isPrioritizedMode: Partial<Record<ControllerModeStr, true>> = {
	[ControllerMode.Disallowed]: true,
	[ControllerMode.Playing]: true,
	[ControllerMode.Paused]: true,
	[ControllerMode.Scrobbled]: true,
	[ControllerMode.Loading]: true,
	[ControllerMode.Unknown]: true,
	[ControllerMode.Ignored]: true,
	[ControllerMode.Err]: true,
	[ControllerMode.Loved]: true,
	[ControllerMode.Unloved]: true,
};

type updateEvent = {
	updateEditStatus: (isEditing: boolean) => void;
};

const disabledTabs = BrowserStorage.getStorage(BrowserStorage.DISABLED_TABS);

/**
 * Object that handles song playback and scrobbling actions.
 */
export default class Controller {
	public connector: BaseConnector;
	public isEnabled: boolean;
	private mode: ControllerModeStr;
	private tempMode: ControllerModeStr | null;
	private timeoutId: NodeJS.Timeout | undefined = undefined;

	private pipeline = new Pipeline();
	private playbackTimer = new Timer();
	private replayDetectionTimer = new Timer();

	private currentSong: Song | null = null;
	private isReplayingSong = false;
	private shouldScrobblePodcasts = true;
	private scrobbleCacheId: number | null = null;
	private blocklist: Blocklist;
	private isPaused = false;

	private forceScrobble = false;
	private shouldHaveScrobbled = false;

	private isEditing = false;
	private setNotEditingTimeout = setTimeout(() => {
		// do nothing
	}, 0);
	private eventEmitter = new EventEmitter<updateEvent>();
	private tabId = sendContentMessage({
		type: 'getTabId',
		payload: undefined,
	});

	/**
	 * Mutates this.currentSong to sync disallowed reason, and returns whether song should scrobble
	 *
	 * @returns true if song should scrobble; false if disallowed.
	 */
	private async shouldScrobble(): Promise<boolean> {
		if (this.forceScrobble) {
			return true;
		}

		if (!this.currentSong) {
			return false;
		}

		if (this.currentSong.parsed.scrobblingDisallowedReason) {
			return false;
		}

		if (
			!(await this.blocklist.shouldScrobbleChannel(
				this.connector.getChannelId?.(),
			))
		) {
			this.currentSong.parsed.scrobblingDisallowedReason =
				'ForbiddenChannel';
			return false;
		}

		if (this.currentSong?.flags.hasBlockedTag) {
			this.currentSong.parsed.scrobblingDisallowedReason = 'ForbiddenTag';
			return false;
		}

		return true;
	}

	/**
	 * Function that handles updating the scrobble info box
	 */
	private async getInfoBoxElement(): Promise<HTMLDivElement | null> {
		if (
			!this.connector.scrobbleInfoLocationSelector ||
			// infobox is disabled in options
			!(await Options.getOption(
				Options.USE_INFOBOX,
				this.connector.meta.id,
			))
		) {
			return null;
		}

		const parentEl = document.querySelector(
			this.connector.scrobbleInfoLocationSelector,
		);
		if (!parentEl) {
			return null;
		}

		// check if infoBoxEl was already created
		let infoBoxElement = document.querySelector<HTMLDivElement>(
			'#scrobbler-infobox-el',
		);

		// check if element is still in the correct place
		if (infoBoxElement) {
			if (infoBoxElement.parentElement !== parentEl) {
				infoBoxElement.remove();
			} else {
				return infoBoxElement;
			}
		}

		// if it was not in the correct place or didn't exist, create it
		infoBoxElement = document.createElement('div');
		infoBoxElement.setAttribute('id', 'scrobbler-infobox-el');

		// style the infobox
		for (const prop in this.connector.scrobbleInfoStyle) {
			infoBoxElement.style[prop] =
				this.connector.scrobbleInfoStyle[prop] ?? '';
		}

		parentEl.appendChild(infoBoxElement);
		return infoBoxElement;
	}

	private async updateInfoBox() {
		let oldInfoBoxText: string | false = false;
		const infoBoxElement = await this.getInfoBoxElement();
		if (!infoBoxElement) {
			// clean up
			const infoBoxElement = document.querySelector<HTMLDivElement>(
				'#scrobbler-infobox-el',
			);
			if (infoBoxElement) {
				infoBoxElement.remove();
			}
			return;
		}
		const textEl = infoBoxElement.querySelector('span');
		if (textEl) {
			oldInfoBoxText = textEl.innerText;
		}

		const mode = this.getMode();
		const infoBoxText = Util.getInfoBoxText(mode, this.currentSong);

		// Check if infobox needs to be updated
		if (!oldInfoBoxText || infoBoxText !== oldInfoBoxText) {
			const img = document.createElement('img');
			img.setAttribute(
				'src',
				browser.runtime.getURL('./icons/icon_main_48.png'),
			);
			img.setAttribute('alt', 'Web Scrobbler state:');
			img.setAttribute('style', 'height: 1.2em');

			const info = document.createElement('span');
			info.innerText = infoBoxText;

			// Clear old contents of infoBoxElement
			while (infoBoxElement.firstChild) {
				infoBoxElement.removeChild(infoBoxElement.firstChild);
			}
			infoBoxElement.appendChild(img);
			infoBoxElement.appendChild(info);
		}
	}

	/**
	 * @param tabId - Tab ID
	 * @param connector - Connector match object
	 * @param isEnabled - Flag indicates initial stage
	 */
	constructor(connector: BaseConnector, isEnabled: boolean) {
		this.connector = connector;
		this.blocklist = new Blocklist(this.connector.meta.id);
		this.isEnabled = isEnabled;
		this.mode = isEnabled ? ControllerMode.Base : ControllerMode.Disabled;
		this.onModeChanged();
		this.tempMode = null; // temporary default setting for now
		Options.getOption(Options.SCROBBLE_PODCASTS, connector.meta.id)
			.then((shouldScrobblePodcasts) => {
				if (typeof shouldScrobblePodcasts !== 'boolean') {
					return;
				}
				this.shouldScrobblePodcasts = shouldScrobblePodcasts;
			})
			.catch((err) => {
				debugLog(err, 'error');
			});

		this.debugLog(
			`Created controller for ${connector.meta.label} connector`,
		);

		setupContentListeners(
			contentListener({
				type: 'skipCurrentSong',
				fn: () => {
					this.skipCurrentSong();
				},
			}),
			contentListener({
				type: 'toggleLove',
				fn: ({ isLoved, shouldShowNotification }) => {
					this.toggleLove(isLoved, shouldShowNotification);
				},
			}),
			contentListener({
				type: 'updateLove',
				fn: ({ isLoved }) => {
					this.currentSong?.setLoveStatus(isLoved, true);
				},
			}),
			contentListener({
				type: 'reprocessSong',
				fn: () => {
					this.reprocessSong();
				},
			}),
			contentListener({
				type: 'setEditState',
				fn: (isEditing) => {
					this.isEditing = isEditing;
					this.eventEmitter.emit('updateEditStatus', isEditing);

					if (isEditing) {
						clearTimeout(this.setNotEditingTimeout);
						this.setNotEditingTimeout = setTimeout(() => {
							this.isEditing = false;
							this.eventEmitter.emit('updateEditStatus', false);
						}, 5000);
					}
				},
			}),
			contentListener({
				type: 'resetData',
				fn: () => {
					this.resetSongData();
				},
			}),
			contentListener({
				type: 'setConnectorState',
				fn: (isEnabled) => {
					this.setConnectorState(isEnabled);
				},
			}),
			contentListener({
				type: 'disableConnectorUntilTabIsClosed',

				fn: () => this.disableUntilTabIsClosed(),
			}),
			contentListener({
				type: 'getConnectorDetails',
				fn: () => ({
					mode: this.getMode(),
					permanentMode: this.mode,
					song: this.currentSong?.getCloneableData() ?? null,
				}),
			}),
			contentListener({
				type: 'forceScrobbleSong',
				fn: () => {
					this.forceScrobble = true;
					if (this.shouldHaveScrobbled) {
						void this.scrobbleSong();
					} else {
						void this.setSongNowPlaying();
					}
				},
			}),
			contentListener({
				type: 'getChannelDetails',
				fn: () => ({
					connector: this.connector.meta,
					channelInfo: this.connector.getChannelInfo?.(),
				}),
			}),
			contentListener({
				type: 'addToBlocklist',
				fn: async () => {
					await this.blocklist.addToBlocklist(
						this.connector.getChannelInfo?.() ?? null,
					);
					this.setMode(ControllerMode.Disallowed);
				},
			}),
			contentListener({
				type: 'removeFromBlocklist',
				fn: async () => {
					await this.blocklist.removeFromBlocklist(
						this.connector.getChannelInfo?.()?.id ?? null,
					);
					if (this.shouldHaveScrobbled) {
						void this.scrobbleSong();
					} else {
						void this.setSongNowPlaying();
					}
				},
			}),
		);
	}

	/** Listeners. */

	/**
	 * Called if current song is updated.
	 */
	public onSongUpdated(): void {
		this.updateInfoBox();
		sendContentMessage({
			type: 'songUpdate',
			payload: this.currentSong?.getCloneableData() ?? null,
		});
	}

	/**
	 * Called if a controller mode is changed.
	 */
	public onModeChanged(): void {
		this.updateInfoBox();
		sendContentMessage({
			type: 'controllerModeChange',
			payload: {
				mode: this.getMode(),
				permanentMode: this.mode,
			},
		});
	}

	/**
	 * Called if a new event is dispatched.
	 *
	 * @param event - Event generated by the controller.
	 */
	public async onControllerEvent(event: string): Promise<void> {
		switch (event) {
			case ControllerEvents.SongNowPlaying: {
				const song = this.getCurrentSong();
				if (
					!song ||
					song.flags.isReplaying ||
					!(await this.shouldScrobble()) ||
					!this.currentSong?.isValid()
				) {
					break;
				}
				const id = await this.tabId;
				if (!id) {
					break;
				}

				sendContentMessage({
					type: 'showNowPlaying',
					payload: {
						song: song.getCloneableData(),
						connector: this.connector.meta,
					},
				});
				break;
			}
			case ControllerEvents.ControllerReset: {
				const song = this.getCurrentSong();
				if (song) {
					sendContentMessage({
						type: 'clearNowPlaying',
						payload: {
							song: song.getCloneableData(),
						},
					});
				}
				break;
			}
			case ControllerEvents.SongUnrecognized: {
				const song = this.getCurrentSong();
				if (!song || !(await this.shouldScrobble())) {
					break;
				}
				const id = await this.tabId;
				if (!id) {
					break;
				}

				sendContentMessage({
					type: 'showSongNotRecognized',
					payload: {
						song: song.getCloneableData(),
						connector: this.connector.meta,
					},
				});
				break;
			}
		}

		this.updateInfoBox();
	}

	/** Public functions */

	/**
	 * Switch the state of controller.
	 * @param flag - True means enabled and vice versa
	 */
	public setEnabled(flag: boolean): void {
		this.isEnabled = flag;

		if (flag) {
			this.setMode(ControllerMode.Base);
		} else {
			this.resetState();
			this.setMode(ControllerMode.Disabled);
		}
	}

	/**
	 * Do finalization before unloading controller.
	 */
	public finish(): void {
		this.debugLog(
			`Remove controller for ${this.connector.meta.label} connector`,
		);
		this.resetState();
	}

	/**
	 * Reset song data and process it again.
	 */
	public async resetSongData(): Promise<void> {
		this.assertSongIsPlaying();

		this.currentSong?.resetInfo();
		await SavedEdits.removeSongInfo(this.currentSong);

		this.unprocessSong();
		void this.processSong();
	}

	/**
	 * Make the controller to ignore current song.
	 */
	skipCurrentSong(): void {
		this.assertSongIsPlaying();
		if (!assertSongNotNull(this.currentSong)) {
			return;
		}

		this.setMode(ControllerMode.Skipped);

		this.currentSong.flags.isSkipped = true;
		this.shouldHaveScrobbled = false;
		this.forceScrobble = false;

		this.playbackTimer.reset();
		this.replayDetectionTimer.reset();

		this.onSongUpdated();
	}

	/**
	 * Get connector match object.
	 * @returns Connector
	 */
	getConnector(): ConnectorMeta {
		return this.connector.meta;
	}

	/**
	 * Get current song as plain object.
	 * @returns Song copy
	 */
	getCurrentSong(): Song | null {
		return this.currentSong;
	}

	/**
	 * Get current controller mode.
	 * @returns Controller mode
	 */
	getMode(): (typeof ControllerMode)[keyof typeof ControllerMode] {
		const pausableModes = [
			ControllerMode.Playing,
			ControllerMode.Scrobbled,
		];
		if (this.tempMode !== null) {
			return this.tempMode;
		}
		if (pausableModes.includes(this.mode) && this.isPaused) {
			return ControllerMode.Paused;
		}
		return this.mode;
	}

	/**
	 * Sets data for current song from user input
	 * @param data - Object containing song data
	 */
	async setUserSongData(data: Options.SavedEdit): Promise<void> {
		this.assertSongIsPlaying();
		if (!assertSongNotNull(this.currentSong)) {
			return;
		}

		if (this.currentSong.flags.isScrobbled) {
			throw new Error('Unable to set user data for scrobbled song');
		}

		await SavedEdits.saveSongInfo(this.currentSong, data);

		this.unprocessSong();
		void this.processSong();
	}

	/**
	 * Reprocess currently playing song without otherwise changing it.
	 */
	reprocessSong(): void {
		this.assertSongIsPlaying();
		if (!assertSongNotNull(this.currentSong)) {
			return;
		}

		this.unprocessSong();
		void this.processSong();
	}

	/**
	 * Send request to love or unlove current song.
	 * @param isLoved - Flag indicated song is loved
	 * @param shouldShowNotification - Flag indicating that a notification should show up
	 */
	async toggleLove(
		isLoved: boolean,
		shouldShowNotification: boolean,
	): Promise<void> {
		this.assertSongIsPlaying();
		if (!assertSongNotNull(this.currentSong)) {
			return;
		}
		if (!this.currentSong.isValid()) {
			throw new Error('No valid song is now playing');
		}

		// set love status optimistically, amend to revert if it were to fail.
		this.currentSong.setLoveStatus(isLoved, true);
		this.onSongUpdated();
		try {
			if (isLoved) {
				this.setTempMode(ControllerMode.Loved);
			} else {
				this.setTempMode(ControllerMode.Unloved);
			}
			await sendContentMessage({
				type: 'toggleLove',
				payload: {
					song: this.currentSong.getCloneableData(),
					isLoved,
					shouldShowNotification,
				},
			});
		} catch {
			this.currentSong.setLoveStatus(!isLoved, true);
		}

		this.onSongUpdated();
	}

	/**
	 * React on love/unlove.
	 * @param isLoved - Whether song is now liked or unliked
	 */
	async onLoveChanged(isLoved: boolean | null): Promise<void> {
		if (!this.currentSong) {
			return;
		}

		/**
		 * Only update love status for some specific modes
		 */
		const loveChangeableModes = [
			ControllerMode.Playing,
			ControllerMode.Scrobbled,
		];
		if (!loveChangeableModes.includes(this.mode)) {
			return;
		}

		/**
		 * If there has not been definitive state before,
		 * just change state without sending anything to service.
		 * We dont want the extension to randomly unlove songs
		 * on scrobbling service because user didn't do it on
		 * streaming service.
		 */
		if (this.currentSong.flags.isLovedInService === null) {
			this.currentSong.flags.isLovedInService = isLoved;
			return;
		}

		/**
		 * If suddenly we are not receiving definitive state anymore
		 * be safe and reset the isloved state
		 */
		if (isLoved === null) {
			this.currentSong.flags.isLovedInService = null;
			return;
		}

		/**
		 * State did not change, don't do anything.
		 */
		if (this.currentSong.flags.isLovedInService === isLoved) {
			return;
		}

		/**
		 * Song already had fetched a definitive loved state,
		 * and this one is different.
		 * This means user has actively changed it.
		 * Change if option suggests so.
		 */
		this.currentSong.flags.isLovedInService = isLoved;
		if (
			await Options.getOption(
				Options.AUTO_TOGGLE_LOVE,
				this.connector.meta.id,
			)
		) {
			if (
				// do not show notification if:
				// 1. song is already loved and is being toggled to love status
				// 2. song is already unloved and is being toggled to unlove status
				(this.currentSong.metadata.userloved === true && isLoved) ||
				(this.currentSong.metadata.userloved === false && !isLoved)
			) {
				return;
			}
			// do send notification if song has not yet been (un)loved toggled yet
			this.toggleLove(isLoved, true);
		}
	}

	/**
	 * React on state change.
	 * @param newState - State of connector
	 */
	onStateChanged(newState: State): void {
		if (!this.isEnabled) {
			return;
		}

		/*
		 * Empty state has same semantics as reset; even if isPlaying,
		 * we don't have enough data to use.
		 */
		if (isStateEmpty(newState)) {
			if (this.currentSong) {
				this.debugLog('Received empty state - resetting');

				this.reset();
			}

			if (newState.isPlaying) {
				this.debugLog(
					`State from connector doesn't contain enough information about the playing track: ${toString(
						newState as Record<string, unknown>,
					)}`,
					'warn',
				);
			}

			return;
		}

		const isSongChanged = this.isSongChanged(newState);

		if (isSongChanged || this.isReplayingSong) {
			if (newState.isPlaying) {
				this.processNewState(newState);
			} else {
				this.reset();
			}
		} else {
			this.processCurrentState(newState);
		}
	}

	/** Internal functions */

	/**
	 * Set the mode of the controller
	 *
	 * @param mode - new controller mode
	 */
	private setMode(mode: ControllerModeStr): void {
		if (!mode) {
			throw new Error(`Unknown mode: ${mode}`);
		}

		this.mode = mode;
		this.onModeChanged();
	}

	/**
	 * Checks if the temp icon/mode is visible.
	 */
	private isTempIconVisible() {
		return this.timeoutId !== undefined;
	}

	/**
	 * Temporarily set the mode of the controller,
	 * then returns to previous mode after 5 seconds.
	 *
	 * @param newMode - new controller mode to be set
	 *
	 */
	private setTempMode(newMode: ControllerModeStr) {
		if (this.isTempIconVisible()) {
			clearTimeout(this.timeoutId);
			this.timeoutId = undefined;
		}
		const TEMP_ICON_DISPLAY_DURATION = 5000;
		this.tempMode = newMode;
		this.onModeChanged();
		this.timeoutId = setTimeout(() => {
			this.timeoutId = undefined;
			this.tempMode = null;
			this.onModeChanged();
		}, TEMP_ICON_DISPLAY_DURATION);
	}

	private dispatchEvent(event: string): void {
		if (!event) {
			throw new Error(`Unknown event: ${event}`);
		}

		this.onControllerEvent(event);
	}

	/**
	 * Process connector state as new one.
	 * @param newState - Connector state
	 */
	private processNewState(newState: State): void {
		/*
		 * We've hit a new song (or replaying the previous one)
		 * clear any previous song and its bindings.
		 */
		this.isPaused = false;
		this.resetState();
		this.currentSong = new Song(newState, this.connector.meta);
		this.currentSong.flags.isReplaying = this.isReplayingSong;

		this.debugLog(
			`New song detected: ${toString(
				newState as Record<string, string>,
			)}`,
		);

		if (!this.shouldScrobblePodcasts && newState.isPodcast) {
			this.skipCurrentSong();
			return;
		}

		/*
		 * Start the timer, actual time will be set after processing
		 * is done; we can call doScrobble directly, because the timer
		 * will be allowed to trigger only after the song is validated.
		 */
		this.playbackTimer.start(() => {
			void this.scrobbleSong();
		});

		this.replayDetectionTimer.start(() => {
			this.debugLog('Replaying song...');
			this.isReplayingSong = true;
		});

		/*
		 * If we just detected the track and it's not playing yet,
		 * pause the timer right away; this is important, because
		 * isPlaying flag binding only calls pause/resume which assumes
		 * the timer is started.
		 */
		if (!newState.isPlaying) {
			this.setPaused();
		}

		void this.processSong();
		this.isReplayingSong = false;
	}

	/**
	 * Process connector state as current one.
	 * @param newState - Connector state
	 */
	private async processCurrentState(newState: State): Promise<void> {
		if (!assertSongNotNull(this.currentSong)) {
			return;
		}
		if (this.currentSong.flags.isSkipped) {
			return;
		}

		const {
			currentTime,
			isPlaying,
			trackArt,
			duration,
			scrobblingDisallowedReason,
		} = newState;
		const isPlayingStateChanged =
			this.currentSong.parsed.isPlaying !== isPlaying;

		this.currentSong.parsed.currentTime = currentTime;
		this.currentSong.parsed.isPlaying = isPlaying;
		this.currentSong.parsed.trackArt = trackArt;
		this.currentSong.parsed.scrobblingDisallowedReason =
			scrobblingDisallowedReason;

		if (this.isNeedToUpdateDuration(newState) && duration) {
			this.updateSongDuration(duration);
		}

		if (isPlayingStateChanged && isPlaying !== void 0) {
			this.onPlayingStateChanged(isPlaying);
		} else if (
			this.mode === ControllerMode.Disallowed &&
			(await this.shouldScrobble()) &&
			isPlaying
		) {
			// we need to unset disallowed whenever needed.
			// this is not necessarily tied to pausing/unpausing
			this.setSongNowPlaying();
		}
	}

	/**
	 * Reset controller state.
	 */
	private resetState(): void {
		this.dispatchEvent(ControllerEvents.ControllerReset);

		this.playbackTimer.reset();
		this.replayDetectionTimer.reset();
		this.shouldHaveScrobbled = false;
		this.forceScrobble = false;

		this.currentSong = null;
	}

	/**
	 * Process song using pipeline module.
	 */
	private async processSong(): Promise<void> {
		if (!assertSongNotNull(this.currentSong)) {
			return;
		}
		this.shouldHaveScrobbled = false;
		this.forceScrobble = false;

		if (await this.shouldScrobble()) {
			this.setMode(ControllerMode.Loading);
		} else {
			this.setMode(ControllerMode.Disallowed);
		}

		if (
			!(await this.pipeline.process(
				this.currentSong,
				this.connector.meta,
			))
		) {
			return;
		}

		this.debugLog(
			`Song finished processing: ${this.currentSong.toString()}`,
		);

		// Processing cleans this flag
		this.currentSong.flags.isMarkedAsPlaying = false;

		await this.updateTimers(this.currentSong.getDuration());

		/*
		 * If the song is playing, mark it immediately;
		 * otherwise will be flagged in isPlaying binding.
		 */
		if (!this.currentSong.isValid()) {
			this.setSongNotRecognized();
		} else if (!(await this.shouldScrobble())) {
			this.setMode(ControllerMode.Disallowed);
		} else if (this.currentSong.parsed.isPlaying) {
			/*
			 * If the song is playing, mark it immediately;
			 * otherwise will be flagged in isPlaying binding.
			 */
			if (!(await this.shouldScrobble())) {
				this.setMode(ControllerMode.Disallowed);
			} else if (this.currentSong.parsed.isPlaying) {
				/*
					* If playback timer is expired, then the extension
					* will scrobble song immediately, and there's no need
					* to set song as now playing. We should dispatch
					a "now playing" event, though.
					*/
				if (!this.playbackTimer.isExpired()) {
					void this.setSongNowPlaying();
				} else {
					this.dispatchEvent(ControllerEvents.SongNowPlaying);
				}
			} else {
				this.setMode(ControllerMode.Base);
			}
		} else {
			this.setSongNotRecognized();
		}

		this.onSongUpdated();
	}

	/**
	 * Called when song was already flagged as processed, but now is
	 * entering the pipeline again.
	 */
	private unprocessSong(): void {
		if (!assertSongNotNull(this.currentSong)) {
			return;
		}

		this.debugLog(`Song unprocessed: ${this.currentSong.toString()}`);
		this.debugLog('Clearing playback timer destination time');

		this.currentSong.resetData();

		this.shouldHaveScrobbled = false;
		this.forceScrobble = false;

		this.playbackTimer.update(null);
		this.replayDetectionTimer.update(null);
	}

	/**
	 * Called when playing state is changed.
	 * @param value - New playing state
	 */
	private async onPlayingStateChanged(value: boolean | null): Promise<void> {
		this.debugLog(`isPlaying state changed to ${String(value)}`);

		if (value && this.currentSong) {
			this.setResumedPlaying();
			this.playbackTimer.resume();
			this.replayDetectionTimer.resume();

			const { isMarkedAsPlaying } = this.currentSong.flags;

			// Maybe the song was not marked as playing yet
			if (
				!isMarkedAsPlaying &&
				this.currentSong.isValid() &&
				(await this.shouldScrobble())
			) {
				void this.setSongNowPlaying();
			} else {
				// Resend current mode
				this.onModeChanged();
			}
		} else {
			this.setPaused();
		}
	}

	/**
	 * Check if song is changed by given connector state.
	 * @param newState - Connector state
	 * @returns Check result
	 */
	private isSongChanged(newState: State): boolean {
		if (!assertSongNotNull(this.currentSong)) {
			return true;
		}

		for (const field of fieldsToCheckSongChange) {
			if (
				field in newState &&
				field in this.currentSong.parsed &&
				// @ts-expect-error We check that the fields exist, TS is just being difficult.
				newState[field] !== this.currentSong.parsed[field]
			) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Check if song duration should be updated.
	 * @param newState - Connector state
	 * @returns Check result
	 */
	private isNeedToUpdateDuration(newState: State): boolean {
		return (
			Boolean(newState.duration) &&
			this.currentSong?.parsed.duration !== newState.duration
		);
	}

	/**
	 * Update song duration value.
	 * @param duration - Duration in seconds
	 */
	private updateSongDuration(duration: number): void {
		if (!assertSongNotNull(this.currentSong)) {
			return;
		}
		this.debugLog(`Update duration: ${duration}`);

		this.currentSong.parsed.duration = duration;

		void this.updateTimers(duration);
	}

	/**
	 * Update internal timers.
	 * @param duration - Song duration in seconds
	 */
	private async updateTimers(
		duration: number | null | undefined,
	): Promise<void> {
		if (this.playbackTimer.isExpired()) {
			this.debugLog('Attempt to update expired timers', 'warn');
			return;
		}

		const rawPercent = await Options.getOption(
			Options.SCROBBLE_PERCENT,
			this.connector.meta.id,
		);
		const percent = parseScrobblePercent(rawPercent);

		const secondsToScrobble = getSecondsToScrobble(duration, percent);

		if (secondsToScrobble !== -1) {
			this.playbackTimer.update(secondsToScrobble);
			this.replayDetectionTimer.update(duration);

			const remainedSeconds = this.playbackTimer.getRemainingSeconds();
			this.debugLog(
				`The song will be scrobbled in ${
					remainedSeconds ?? -999
				} seconds`,
			);
			this.debugLog(`The song will be repeated in ${duration} seconds`);
		} else {
			this.debugLog('The song is too short to scrobble');
		}
	}

	/**
	 * Contains all actions to be done when song is ready to be marked as
	 * now playing.
	 */
	private async setSongNowPlaying(): Promise<void> {
		if (
			!assertSongNotNull(this.currentSong) ||
			!this.currentSong.isValid() ||
			!(await this.shouldScrobble())
		) {
			return;
		}

		/**
		 * Sometimes a song may change state before processing is done.
		 * This can cause race condition especially with the blocked tags pipeline
		 * which decides whether a song should be allowed to be played asynchronously.
		 * For this reason we must check again here if the song is loading.
		 */
		if (!this.currentSong.flags.finishedProcessing) {
			this.debugLog('Song set as loading');
			this.setMode(ControllerMode.Loading);
			return;
		}

		this.currentSong.flags.isMarkedAsPlaying = true;

		const results = await sendContentMessage({
			type: 'setNowPlaying',
			payload: {
				song: this.currentSong.getCloneableData(),
			},
		});

		if (isAnyResult(results, ServiceCallResult.RESULT_OK)) {
			this.debugLog('Song set as now playing');
			this.setMode(ControllerMode.Playing);
		} else {
			this.debugLog("Song isn't set as now playing");
			this.setMode(ControllerMode.Err);
		}

		this.dispatchEvent(ControllerEvents.SongNowPlaying);
	}

	private async setPaused(): Promise<void> {
		this.playbackTimer.pause();
		this.replayDetectionTimer.pause();

		if (
			!assertSongNotNull(this.currentSong) ||
			!this.currentSong.isValid() ||
			!(await this.shouldScrobble())
		) {
			return;
		}

		this.isPaused = true;
		this.onModeChanged();
		await sendContentMessage({
			type: 'setPaused',
			payload: {
				song: this.currentSong.getCloneableData(),
			},
		});
	}

	private async setResumedPlaying(): Promise<void> {
		this.isPaused = false;

		if (
			!assertSongNotNull(this.currentSong) ||
			!this.currentSong.isValid() ||
			!(await this.shouldScrobble())
		) {
			return;
		}

		this.onModeChanged();
		await sendContentMessage({
			type: 'setResumedPlaying',
			payload: {
				song: this.currentSong.getCloneableData(),
			},
		});
	}

	/**
	 * Notify user that song it not recognized by the extension.
	 */
	private setSongNotRecognized(): void {
		this.setMode(ControllerMode.Unknown);
		this.dispatchEvent(ControllerEvents.SongUnrecognized);
	}

	/**
	 * Enable or disable a connector
	 *
	 * @param isEnabled - Whether to enable or disable connector.
	 */
	private setConnectorState(isEnabled: boolean) {
		this.setEnabled(isEnabled);
		Options.setConnectorEnabled(this.getConnector(), isEnabled);
	}

	/**
	 * Disable connector until tab is closed
	 */
	private async disableUntilTabIsClosed() {
		const disabledTabList = await disabledTabs.get();
		const currentTab = await this.tabId;
		disabledTabs.set({
			...disabledTabList,
			[currentTab ?? -1]: {
				...(disabledTabList?.[currentTab ?? -1] ?? {}),
				[this.connector.meta.id]: true,
			},
		});
		this.setEnabled(false);
	}

	/**
	 * Tries to save failed scrobble due to disallowed/unrecognized.
	 *
	 * @returns true if scrobble is failed; false if should scrobble
	 */
	private async saveFailedScrobble(): Promise<boolean> {
		if (!assertSongNotNull(this.currentSong)) {
			return true;
		}

		if (!(await this.shouldScrobble())) {
			this.scrobbleCacheId = await scrobbleCache.pushScrobble({
				song: this.currentSong.getCloneableData(),
				status: ScrobbleStatus.DISALLOWED,
			});
			this.shouldHaveScrobbled = true;
			return true;
		}
		if (!this.currentSong.isValid()) {
			this.scrobbleCacheId = await scrobbleCache.pushScrobble({
				song: this.currentSong.getCloneableData(),
				status: ScrobbleStatus.INVALID,
			});
			this.shouldHaveScrobbled = true;
			return true;
		}
		return false;
	}

	/**
	 * Called when scrobble timer triggers.
	 * The time should be set only after the song is validated and ready
	 * to be scrobbled.
	 */
	private async scrobbleSong(): Promise<void> {
		if (!assertSongNotNull(this.currentSong)) {
			return;
		}

		if (await this.saveFailedScrobble()) {
			return;
		}
		if (this.scrobbleCacheId) {
			scrobbleCache.deleteScrobbles([this.scrobbleCacheId]);
			this.scrobbleCacheId = null;
		}

		// dont scrobble until user stopped editing.
		if (this.isEditing) {
			await new Promise((resolve) => {
				const eventHandler = (isEditing: boolean) => {
					if (!isEditing) {
						this.eventEmitter.off('updateEditStatus', eventHandler);
						resolve(true);
					}
				};
				this.eventEmitter.on('updateEditStatus', eventHandler);
			});
		}

		const results = await sendContentMessage({
			type: 'scrobble',
			payload: {
				songs: [this.currentSong.getCloneableData()],
				currentlyPlaying: true,
			},
		});

		if (isAnyResult(results[0], ServiceCallResult.RESULT_OK)) {
			this.debugLog('Scrobbled successfully');

			this.currentSong.flags.isScrobbled = true;
			this.setMode(ControllerMode.Scrobbled);

			this.onSongUpdated();
		} else if (areAllResults(results[0], ServiceCallResult.RESULT_IGNORE)) {
			this.debugLog('Song is ignored by service');
			this.setMode(ControllerMode.Ignored);
		} else {
			this.debugLog('Scrobbling failed', 'warn');
			this.setMode(ControllerMode.Err);
		}
	}

	/**
	 * Reset the state of the connector, removing currently playing song if there is one.
	 */
	private reset(): void {
		this.resetState();
		this.setMode(ControllerMode.Base);
	}

	/**
	 * Assert whether there is a song playing right now
	 */
	private assertSongIsPlaying(): void {
		if (!this.currentSong) {
			throw new Error('No song is now playing');
		}
	}

	/**
	 * Print debug message prefixed with controller.
	 * @param text - Debug message
	 * @param logType - Log type
	 */
	private debugLog(text: string, logType: DebugLogType = 'log'): void {
		const message = `Controller: ${text}`;
		debugLog(message, logType);
	}
}

/**
 * Check if given connector state is empty.
 * @param state - Connector state
 * @returns Check result
 */
function isStateEmpty(state: State) {
	return !(state.artist && state.track) && !state.uniqueID && !state.duration;
}

/**
 * Get string representation of given object.
 * @param obj - Any object
 * @returns String value
 */
function toString(obj: Record<string, unknown>): string {
	return JSON.stringify(obj, null, 2);
}

function assertSongNotNull(song: Song | null): song is Song {
	if (!song) {
		return false;
	}
	return true;
}
