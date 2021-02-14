/* eslint-disable @typescript-eslint/no-unused-vars */

import { ScrobblerResult } from '@/background/scrobbler/ScrobblerResult';
import { Timer } from '@/background/object/timer';

import {
	areAllResults,
	debugLog,
	getSecondsToScrobble,
	isAnyResult,
	LogType,
} from '@/background/util/util';
import {
	getOption,
	SCROBBLE_PERCENT,
	SCROBBLE_PODCASTS,
} from '@/background/storage/options';

import { ControllerMode } from '@/background/object/controller-mode';
import { ParsedSongInfo, EditedSongInfo } from '@/background/object/song';
import { ConnectorEntry } from '@/common/connector-entry';
import { ScrobblerManager } from '@/background/scrobbler/ScrobblerManager';
import { NowPlayingListener } from '@/background/object/controller/NowPlayingListener';
import { ModeChangeListener } from '@/background/object/controller/ModeChangeListener';
import { SongUpdateListener } from '@/background/object/controller/SongUpdateListener';
import { LoveStatus } from '@/background/model/song/LoveStatus';
import { Song } from '@/background/model/song/Song';
import { ConnectorState } from '@/background/model/ConnectorState';
import {
	ConnectorStateWorker,
	SongUpdateListener2,
} from '@/background/ConnectorStateWorker';
import { SongPipeline } from '@/background/pipeline/SongPipeline';

/**
 * List of song fields used to check if song is changed. If any of
 * these fields are changed, the new song is playing.
 */
const fieldsToCheckSongChange = [
	'artist',
	'track',
	'album',
	'uniqueID',
] as const;

/**
 * Object that handles song playback and scrobbling actions.
 */
export class Controller implements SongUpdateListener2 {
	mode: ControllerMode;
	tabId: number;
	isEnabled: boolean;
	connector: ConnectorEntry;

	playbackTimer: Timer;
	replayDetectionTimer: Timer;

	shouldScrobblePodcasts: boolean;

	private currentSong: Song;

	private nowPlayingListener: NowPlayingListener;
	private songUpdateListener: SongUpdateListener;
	private modeListener: ModeChangeListener;

	private worker: ConnectorStateWorker;

	constructor(
		tabId: number,
		connector: ConnectorEntry,
		isEnabled: boolean,
		private scrobblerManager: ScrobblerManager,
		private songPipeline: SongPipeline
	) {
		this.tabId = tabId;
		this.connector = connector;
		this.isEnabled = isEnabled;
		this.mode = isEnabled ? ControllerMode.Base : ControllerMode.Disabled;

		this.playbackTimer = new Timer();
		this.replayDetectionTimer = new Timer();

		this.shouldScrobblePodcasts = getOption(SCROBBLE_PODCASTS);

		this.debugLog(`Created controller for ${connector.label} connector`);

		this.worker = new ConnectorStateWorker(this);
	}

	onPlayingStateChanged(isPlaying: boolean): void {
		this.debugLog(`isPlaying state changed to ${isPlaying.toString()}`);

		if (isPlaying) {
			this.playbackTimer.resume();
			this.replayDetectionTimer.resume();

			// Maybe the song was not marked as playing yet
			if (
				!this.currentSong.getFlag('isMarkedAsPlaying') &&
				this.currentSong.isValid()
			) {
				this.setSongNowPlaying();
			} else {
				// Resend current mode
				this.setMode(this.mode);
			}
		} else {
			this.playbackTimer.pause();
			this.replayDetectionTimer.pause();
		}
	}

	onSongDurationChanged(duration: number): void {
		if (this.currentSong.isValid()) {
			this.debugLog(`Update duration: ${duration}`);

			this.updateTimers(duration);
		}
	}

	onSongChanged(song: Song): void {
		this.currentSong = song;
		if (!song) {
			this.setMode(ControllerMode.Base);
			this.reset();

			return;
		}

		this.debugLogWithSongInfo('New song detected');

		// TODO Move this to ConnectorStateWorker
		// if (!this.shouldScrobblePodcasts && newState.isPodcast) {
		// 	this.skipCurrentSong();
		// 	return;
		// }

		this.startTimers();
		this.processSong();
	}

	/** Listeners. */

	setSongUpdateListener(listener: SongUpdateListener): void {
		this.songUpdateListener = listener;
	}

	setModeListener(listener: ModeChangeListener): void {
		this.modeListener = listener;
	}

	setNowPlayingListener(listener: NowPlayingListener): void {
		this.nowPlayingListener = listener;
	}

	/** Public functions */

	/**
	 * Switch the state of controller.
	 *
	 * @param flag True means enabled and vice versa
	 */
	setEnabled(flag: boolean): void {
		this.isEnabled = flag;

		if (flag) {
			this.setMode(ControllerMode.Base);
		} else {
			this.reset();
			this.setMode(ControllerMode.Disabled);
		}
	}

	/**
	 * Do finalization before unloading controller.
	 */
	finish(): void {
		this.debugLog(
			`Remove controller for ${this.connector.label} connector`
		);
		this.reset();
	}

	/**
	 * Reset song data and process it again.
	 */
	resetSongData(): void {
		this.assertSongIsPlaying();

		// FIXME Move
		// await SavedEdits.removeSongInfo(this.currentSong);

		// this.currentSong.resetInfo();

		this.unprocessSong();
		// this.processSong();
	}

	/**
	 * Make the controller to ignore current song.
	 */
	skipCurrentSong(): void {
		this.assertSongIsPlaying();

		this.setMode(ControllerMode.Skipped);

		this.currentSong.setFlag('isSkipped', true);

		this.playbackTimer.reset();
		this.replayDetectionTimer.reset();

		this.songUpdateListener.onSongUpdated(this);
	}

	/**
	 * Get connector match object.
	 *
	 * @return Connector
	 */
	getConnector(): ConnectorEntry {
		return this.connector;
	}

	/**
	 * Get current song as plain object.
	 *
	 * @return Song copy
	 */
	getCurrentSong(): Song {
		return this.currentSong;
	}

	/**
	 * Get current controller mode.
	 *
	 * @return Controller mode
	 */
	getMode(): ControllerMode {
		return this.mode;
	}

	/**
	 * Sets data for current song from user input.
	 *
	 * @param data Object contains song data
	 */
	setUserSongData(data: EditedSongInfo): void {
		this.assertSongIsPlaying();

		if (this.currentSong.getFlag('isScrobbled')) {
			throw new Error('Unable to set user data for scrobbled song');
		}

		// FIXME Move
		// await SavedEdits.saveSongInfo(this.currentSong, data);

		this.unprocessSong();
		// this.processSong();
	}

	/**
	 * Send request to love or unlove current song.
	 *
	 * @param loveStatus Flag indicated song is loved
	 */
	async toggleLove(loveStatus: LoveStatus): Promise<void> {
		this.assertSongIsPlaying();

		if (!this.currentSong.isValid()) {
			throw new Error('No valid song is now playing');
		}

		await this.scrobblerManager.sendLoveRequest(
			this.currentSong,
			loveStatus
		);

		this.currentSong.setLoveStatus(loveStatus);
		this.songUpdateListener.onSongUpdated(this);
	}

	/**
	 * React on state change.
	 *
	 * @param newState State of connector
	 */
	onStateChanged(newState: ParsedSongInfo): void {
		if (!this.isEnabled) {
			return;
		}

		this.worker.process(newState);
	}

	private setMode(mode: ControllerMode): void {
		this.mode = mode;
		this.modeListener.onModeChanged(this);
	}

	/**
	 * Reset controller state.
	 */
	private reset(): void {
		this.nowPlayingListener.onReset(this);

		this.playbackTimer.reset();
		this.replayDetectionTimer.reset();

		this.currentSong = null;
	}

	/**
	 * Process song using pipeline module.
	 */
	private async processSong(): Promise<void> {
		this.setMode(ControllerMode.Loading);

		await this.songPipeline.process(this.currentSong);

		this.debugLog('Song finished processing');

		this.postProcessSong();
	}

	/**
	 * Called when song was already flagged as processed, but now is
	 * entering the pipeline again.
	 */
	private unprocessSong(): void {
		this.debugLog('Song unprocessed');

		this.currentSong = null;

		this.playbackTimer.update(null);
		this.replayDetectionTimer.update(null);
	}

	private postProcessSong(): void {
		if (this.currentSong.isValid()) {
			this.currentSong.setFlag('isMarkedAsPlaying', false);

			this.updateTimers(this.currentSong.getDuration());

			if (this.currentSong.isPlaying()) {
				if (this.playbackTimer.isExpired()) {
					this.nowPlayingListener.onNowPlaying(this);
				} else {
					this.setSongNowPlaying();
				}
			} else {
				this.setMode(ControllerMode.Base);
			}
		} else {
			this.setSongNotRecognized();
		}

		this.songUpdateListener.onSongUpdated(this);
	}

	private replayCurrentSong(): void {
		this.debugLogWithSongInfo('Replaying song');

		this.startTimers();
		this.postProcessSong();
	}

	/**
	 * Add current song to scrobble storage.
	 *
	 * @param scrobblerIds Array of scrobbler IDs
	 */
	private async addSongToScrobbleStorage(
		scrobblerIds?: string[]
	): Promise<void> {
		let boundScrobblerIds = scrobblerIds;
		if (!boundScrobblerIds) {
			boundScrobblerIds = Array.from(
				this.scrobblerManager
			).map((scrobbler) => scrobbler.getId());
		}

		// TODO Fix
		// await ScrobbleStorage.addSong(
		// 	this.currentSong,
		// 	boundScrobblerIds
		// );
	}

	/**
	 * Check if the current song should be saved to the scrobble storage.
	 *
	 * @return Check result
	 */
	private isNeedToAddSongToScrobbleStorage(): boolean {
		if (this.currentSong && !this.currentSong.isValid()) {
			const secondsToScrobble = this.getSecondsToScrobble(
				this.currentSong.getDuration()
			);
			if (secondsToScrobble !== -1) {
				return this.playbackTimer.getElapsed() >= secondsToScrobble;
			}
		}

		return false;
	}

	private startTimers(): void {
		// Start the timer; actual time will be set after processing is done.
		this.playbackTimer.start(() => {
			this.scrobbleSong();
		});

		this.replayDetectionTimer.start(() => {
			this.replayCurrentSong();
		});
	}

	/**
	 * Update internal timers.
	 *
	 * @param duration Song duration in seconds
	 */
	private updateTimers(duration: number): void {
		if (this.playbackTimer.isExpired()) {
			this.debugLog('Attempt to update expired timers', 'warn');
			return;
		}

		const secondsToScrobble = this.getSecondsToScrobble(duration);
		if (secondsToScrobble !== -1) {
			this.playbackTimer.update(secondsToScrobble);
			this.replayDetectionTimer.update(duration);

			const remainedSeconds = this.playbackTimer.getRemainingSeconds();
			this.debugLog(
				`The song will be scrobbled in ${remainedSeconds} seconds`
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
		this.currentSong.setFlag('isMarkedAsPlaying', true);

		const results = await this.scrobblerManager.sendNowPlayingRequest(
			this.currentSong
		);
		if (isAnyResult(results, ScrobblerResult.RESULT_OK)) {
			this.debugLogWithSongInfo('Set as now playing');

			this.setMode(ControllerMode.Playing);
		} else {
			this.debugLogWithSongInfo('Is not set as now playing');

			this.setMode(ControllerMode.Err);
		}

		this.nowPlayingListener.onNowPlaying(this);
	}

	/**
	 * Notify user that song it not recognized by the extension.
	 */
	private setSongNotRecognized(): void {
		this.setMode(ControllerMode.Unknown);
		this.nowPlayingListener.onNowPlaying(this);
	}

	/**
	 * Called when scrobble timer triggers.
	 * The time should be set only after the song is validated and ready
	 * to be scrobbled.
	 */
	private async scrobbleSong(): Promise<void> {
		const results = await this.scrobblerManager.sendScrobbleRequest(
			this.currentSong
		);
		const failedScrobblerIds = results
			.filter((result) => !result.is(ScrobblerResult.RESULT_OK))
			.map((result) => result.getScrobblerId());

		const isAnyOkResult = results.length > failedScrobblerIds.length;
		if (isAnyOkResult) {
			this.debugLogWithSongInfo(`Scrobbled successfully`);

			this.currentSong.setFlag('isScrobbled', true);
			this.setMode(ControllerMode.Scrobbled);

			this.songUpdateListener.onSongUpdated(this);
		} else if (areAllResults(results, ScrobblerResult.RESULT_IGNORE)) {
			this.debugLog('Song is ignored by service');
			this.setMode(ControllerMode.Ignored);
		} else {
			this.debugLog('Scrobbling failed', 'warn');
			this.setMode(ControllerMode.Err);
		}

		if (failedScrobblerIds.length > 0) {
			this.addSongToScrobbleStorage(failedScrobblerIds);
		}
	}

	private getSecondsToScrobble(duration: number): number {
		const percent = getOption<number>(SCROBBLE_PERCENT);
		return getSecondsToScrobble(duration, percent);
	}

	private assertSongIsPlaying(): void {
		if (!this.currentSong) {
			throw new Error('No song is now playing');
		}
	}

	/**
	 * Print debug message with prefixed tab ID.
	 *
	 * @param text Debug message
	 * @param [logType=log] Log type
	 */
	debugLog(text: string, logType: LogType = 'log'): void {
		const message = `Tab ${this.tabId}: ${text}`;
		debugLog(message, logType);
	}

	debugLogWithSongInfo(text: string): void {
		this.debugLog(`${text}: ${this.currentSong.getArtistTrackString()}`);
	}
}
