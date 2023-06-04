import { ConnectorMeta } from '@/core/connectors';
import * as Options from '@/core/storage/options';
import {
	areAllResults,
	DebugLogType,
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
import { State } from '@/core/types';
import {
	contentListener,
	sendContentMessage,
	setupContentListeners,
} from '@/util/communication';
import EventEmitter from '@/util/emitter';
import * as BrowserStorage from '@/core/storage/browser-storage';
import { debugLog } from '@/core/content/util';

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
	[ControllerMode.Playing]: true,
	[ControllerMode.Scrobbled]: true,
	[ControllerMode.Loading]: true,
	[ControllerMode.Unknown]: true,
	[ControllerMode.Ignored]: true,
	[ControllerMode.Err]: true,
};

type updateEvent = {
	updateEditStatus: (isEditing: boolean) => void;
};

const disabledTabs = BrowserStorage.getStorage(BrowserStorage.DISABLED_TABS);

/**
 * Object that handles song playback and scrobbling actions.
 */
export default class Controller {
	public connector: ConnectorMeta;
	public isEnabled: boolean;
	public mode: ControllerModeStr;

	private pipeline = new Pipeline();
	private playbackTimer = new Timer();
	private replayDetectionTimer = new Timer();

	private currentSong: Song | null = null;
	private isReplayingSong = false;
	private shouldScrobblePodcasts = true;

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
	 * @param tabId - Tab ID
	 * @param connector - Connector match object
	 * @param isEnabled - Flag indicates initial stage
	 */
	constructor(connector: ConnectorMeta, isEnabled: boolean) {
		this.connector = connector;
		this.isEnabled = isEnabled;
		this.mode = isEnabled ? ControllerMode.Base : ControllerMode.Disabled;
		this.setMode(this.mode);
		Options.getOption(Options.SCROBBLE_PODCASTS, connector.id)
			.then((shouldScrobblePodcasts) => {
				if (typeof shouldScrobblePodcasts !== 'boolean') {
					return;
				}
				this.shouldScrobblePodcasts = shouldScrobblePodcasts;
			})
			.catch((err) => {
				debugLog(err, 'error');
			});

		this.debugLog(`Created controller for ${connector.label} connector`);

		setupContentListeners(
			contentListener({
				type: 'skipCurrentSong',
				fn: () => {
					this.skipCurrentSong();
				},
			}),
			contentListener({
				type: 'toggleLove',
				fn: ({ isLoved }) => {
					this.toggleLove(isLoved);
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
					mode: this.mode,
					song: this.currentSong?.getCloneableData() ?? null,
				}),
			})
		);
	}

	/** Listeners. */

	/**
	 * Called if current song is updated.
	 */
	public onSongUpdated(): void {
		sendContentMessage({
			type: 'songUpdate',
			payload: this.currentSong?.getCloneableData() ?? null,
		});
	}

	/**
	 * Called if a controller mode is changed.
	 */
	public onModeChanged(): void {
		sendContentMessage({
			type: 'controllerModeChange',
			payload: this.mode,
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
				if (!song || song.flags.isReplaying) {
					return;
				}
				const id = await this.tabId;
				if (!id) {
					return;
				}

				sendContentMessage({
					type: 'showNowPlaying',
					payload: {
						song: song.getCloneableData(),
						connector: this.connector,
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
				if (!song) {
					return;
				}
				const id = await this.tabId;
				if (!id) {
					return;
				}

				sendContentMessage({
					type: 'showSongNotRecognized',
					payload: {
						song: song.getCloneableData(),
						connector: this.connector,
					},
				});
				break;
			}
		}
		// do nothing
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
			`Remove controller for ${this.connector.label} connector`
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

		this.playbackTimer.reset();
		this.replayDetectionTimer.reset();

		this.onSongUpdated();
	}

	/**
	 * Get connector match object.
	 * @returns Connector
	 */
	getConnector(): ConnectorMeta {
		return this.connector;
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
	async reprocessSong(): Promise<void> {
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
	 */
	async toggleLove(isLoved: boolean): Promise<void> {
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
			await sendContentMessage({
				type: 'toggleLove',
				payload: {
					song: this.currentSong.getCloneableData(),
					isLoved,
				},
			});
		} catch (err) {
			this.currentSong.setLoveStatus(!isLoved, true);
		}

		this.onSongUpdated();
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
						newState as Record<string, unknown>
					)}`,
					'warn'
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
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			throw new Error(`Unknown mode: ${mode}`);
		}

		this.mode = mode;
		this.onModeChanged();
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
		this.resetState();
		this.currentSong = new Song(newState, this.connector);
		this.currentSong.flags.isReplaying = this.isReplayingSong;

		this.debugLog(
			`New song detected: ${toString(newState as Record<string, string>)}`
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
			this.playbackTimer.pause();
			this.replayDetectionTimer.pause();
		}

		void this.processSong();
		this.isReplayingSong = false;
	}

	/**
	 * Process connector state as current one.
	 * @param newState - Connector state
	 */
	private processCurrentState(newState: State): void {
		if (!assertSongNotNull(this.currentSong)) {
			return;
		}
		if (this.currentSong.flags.isSkipped) {
			return;
		}

		const { currentTime, isPlaying, trackArt, duration } = newState;
		const isPlayingStateChanged =
			this.currentSong.parsed.isPlaying !== isPlaying;

		this.currentSong.parsed.currentTime = currentTime;
		this.currentSong.parsed.isPlaying = isPlaying;
		this.currentSong.parsed.trackArt = trackArt;

		if (this.isNeedToUpdateDuration(newState) && duration) {
			this.updateSongDuration(duration);
		}

		if (isPlayingStateChanged && isPlaying !== void 0) {
			this.onPlayingStateChanged(isPlaying);
		}
	}

	/**
	 * Reset controller state.
	 */
	private resetState(): void {
		this.dispatchEvent(ControllerEvents.ControllerReset);

		this.playbackTimer.reset();
		this.replayDetectionTimer.reset();

		this.currentSong = null;
	}

	/**
	 * Process song using pipeline module.
	 */
	private async processSong(): Promise<void> {
		this.setMode(ControllerMode.Loading);
		if (!assertSongNotNull(this.currentSong)) {
			return;
		}

		if (!(await this.pipeline.process(this.currentSong, this.connector))) {
			return;
		}

		this.debugLog(
			`Song finished processing: ${this.currentSong.toString()}`
		);

		if (this.currentSong.isValid()) {
			// Processing cleans this flag
			this.currentSong.flags.isMarkedAsPlaying = false;

			await this.updateTimers(this.currentSong.getDuration());

			/*
			 * If the song is playing, mark it immediately;
			 * otherwise will be flagged in isPlaying binding.
			 */
			if (this.currentSong.parsed.isPlaying) {
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

		this.playbackTimer.update(null);
		this.replayDetectionTimer.update(null);
	}

	/**
	 * Called when playing state is changed.
	 * @param value - New playing state
	 */
	private onPlayingStateChanged(value: boolean | null): void {
		this.debugLog(`isPlaying state changed to ${String(value)}`);

		if (value && this.currentSong) {
			this.playbackTimer.resume();
			this.replayDetectionTimer.resume();

			const { isMarkedAsPlaying } = this.currentSong.flags;

			// Maybe the song was not marked as playing yet
			if (!isMarkedAsPlaying && this.currentSong.isValid()) {
				void this.setSongNowPlaying();
			} else {
				// Resend current mode
				this.setMode(this.mode);
			}
		} else {
			this.playbackTimer.pause();
			this.replayDetectionTimer.pause();
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

		if (this.currentSong.isValid()) {
			void this.updateTimers(duration);
		}
	}

	/**
	 * Update internal timers.
	 * @param duration - Song duration in seconds
	 */
	private async updateTimers(
		duration: number | null | undefined
	): Promise<void> {
		if (this.playbackTimer.isExpired()) {
			this.debugLog('Attempt to update expired timers', 'warn');
			return;
		}

		const percent = await Options.getOption(
			Options.SCROBBLE_PERCENT,
			this.connector.id
		);
		if (typeof percent !== 'number') {
			return;
		}

		const secondsToScrobble = getSecondsToScrobble(duration, percent);

		if (secondsToScrobble !== -1) {
			this.playbackTimer.update(secondsToScrobble);
			this.replayDetectionTimer.update(duration);

			const remainedSeconds = this.playbackTimer.getRemainingSeconds();
			this.debugLog(
				`The song will be scrobbled in ${
					remainedSeconds ?? -999
				} seconds`
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
		if (!assertSongNotNull(this.currentSong)) {
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
				[this.connector.id]: true,
			},
		});
		this.setEnabled(false);
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
				song: this.currentSong.getCloneableData(),
			},
		});

		if (isAnyResult(results, ServiceCallResult.RESULT_OK)) {
			this.debugLog('Scrobbled successfully');

			this.currentSong.flags.isScrobbled = true;
			this.setMode(ControllerMode.Scrobbled);

			this.onSongUpdated();
		} else if (areAllResults(results, ServiceCallResult.RESULT_IGNORE)) {
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
