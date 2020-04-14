'use strict';

define((require) => {
	const Options = require('storage/options');
	const GA = require('service/ga');
	const Util = require('util/util');
	const Song = require('object/song');
	const Timer = require('object/timer');
	const Pipeline = require('pipeline/pipeline');
	const Notifications = require('browser/notifications');
	const ControllerMode = require('object/controller-mode');
	const ScrobbleService = require('object/scrobble-service');
	const ServiceCallResult = require('object/service-call-result');
	const LocalCacheStorage = require('storage/local-cache');

	/**
	 * List of song fields used to check if song is changed. If any of
	 * these fields are changed, the new song is playing.
	 * @type {Array}
	 */
	const fieldsToCheckSongChange = ['artist', 'track', 'album', 'uniqueID'];

	/**
	 * Object that handles song playback and scrobbling actions.
	 */
	class Controller {
		/**
		 * @constructor
		 * @param {Number} tabId Tab ID
		 * @param {Object} connector Connector match object
		 * @param {Boolean} isEnabled Flag indicates initial stage
		 */
		constructor(tabId, connector, isEnabled) {
			this.tabId = tabId;
			this.connector = connector;
			this.isEnabled = isEnabled;
			this.mode = isEnabled ? ControllerMode.Base : ControllerMode.Disabled;
			this.playbackTimer = new Timer();
			this.replayDetectionTimer = new Timer();

			this.currentSong = null;
			this.isReplayingSong = false;
			this.shouldScrobblePodcasts = true;
			(async() => this.shouldScrobblePodcasts = await Options.getOption(Options.SCROBBLE_PODCASTS))();

			this.debugLog(`Created controller for ${connector.label} connector`);

			this.notificationTimeoutId = null;
		}

		/** Public functions */

		/**
		 * Switch the state of controller.
		 * @param {Boolean} flag True means enabled and vice versa
		 */
		setEnabled(flag) {
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
		finish() {
			this.debugLog(`Remove controller for ${this.connector.label} connector`);
			this.resetState();
		}

		/**
		 * Reset song data and process it again.
		 */
		async resetSongData() {
			this.assertSongIsPlaying();

			this.currentSong.resetSongData();
			await LocalCacheStorage.removeSongData(this.currentSong);

			this.unprocessSong();
			this.processSong();
		}

		/**
		 * Make the controller to ignore current song.
		 */
		skipCurrentSong() {
			this.assertSongIsPlaying();

			this.setMode(ControllerMode.Skipped);

			this.currentSong.flags.isSkipped = true;

			this.playbackTimer.reset();
			this.replayDetectionTimer.reset();

			Notifications.clearNowPlaying(this.currentSong);

			this.onSongUpdated();
		}

		/**
		 * Get connector match object.
		 * @return {Object} Connector
		 */
		getConnector() {
			return this.connector;
		}

		/**
		 * Get current song as plain object.
		 * @return {Object} Song copy
		 */
		getCurrentSong() {
			return this.currentSong;
		}

		/**
		 * Get current controller mode.
		 * @return {Object} Controller mode
		 */
		getMode() {
			return this.mode;
		}

		/**
		 * Sets data for current song from user input
		 * @param {Object} data Object contains song data
		 */
		async setUserSongData(data) {
			this.assertSongIsPlaying();

			if (this.currentSong.flags.isScrobbled) {
				throw new Error('Unable to set user data for scrobbled song');
			}

			await LocalCacheStorage.saveSongData(this.currentSong, data);

			this.unprocessSong();
			this.processSong();
		}

		/**
		 * Send request to love or unlove current song.
		 * @param  {Boolean} isLoved Flag indicated song is loved
		 */
		async toggleLove(isLoved) {
			this.assertSongIsPlaying();

			if (!this.currentSong.isValid()) {
				throw new Error('No valid song is now playing');
			}

			await ScrobbleService.toggleLove(this.currentSong, isLoved);

			this.currentSong.setLoveStatus(isLoved);
			this.onSongUpdated();
		}

		/**
		 * Called if current song is updated.
		 */
		onSongUpdated() { // eslint-disable-line no-unused-vars
			throw new Error('This function must be overriden!');
		}

		/**
		 * Called if a controller mode is changed.
		 */
		onModeChanged() {
			throw new Error('This function must be overriden!');
		}

		/**
		 * React on state change.
		 * @param {Object} newState State of connector
		 */
		onStateChanged(newState) {
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
					this.debugLog(`State from connector doesn't contain enough information about the playing track: ${toString(newState)}`, 'warn');
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

		setMode(mode) {
			if (!mode) {
				throw new Error(`Unknown mode: ${mode}`);
			}

			this.mode = mode;
			this.onModeChanged(mode);
		}

		/**
		 * Process connector state as new one.
		 * @param {Object} newState Connector state
		 */
		processNewState(newState) {
			/*
			 * We've hit a new song (or replaying the previous one)
			 * clear any previous song and its bindings.
			 */
			this.resetState();
			this.currentSong = new Song(newState, this.connector);
			this.currentSong.flags.isReplaying = this.isReplayingSong;

			this.debugLog(`New song detected: ${toString(newState)}`);

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
				this.scrobbleSong();
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

			this.processSong();
			this.isReplayingSong = false;
		}

		/**
		 * Process connector state as current one.
		 * @param {Object} newState Connector state
		 */
		processCurrentState(newState) {
			if (this.currentSong.flags.isSkipped) {
				return;
			}

			const { currentTime, isPlaying, trackArt, duration } = newState;
			const isPlayingStateChanged = this.currentSong.parsed.isPlaying !== isPlaying;

			this.currentSong.parsed.currentTime = currentTime;
			this.currentSong.parsed.isPlaying = isPlaying;
			this.currentSong.parsed.trackArt = trackArt;

			if (this.isNeedToUpdateDuration(newState)) {
				this.updateSongDuration(duration);
			}

			if (isPlayingStateChanged) {
				this.onPlayingStateChanged(isPlaying);
			}
		}

		/**
		 * Reset controller state.
		 */
		resetState() {
			this.playbackTimer.reset();
			this.replayDetectionTimer.reset();

			if (this.currentSong !== null) {
				Notifications.clearNowPlaying(this.currentSong);
			}
			this.currentSong = null;
		}

		/**
		 * Process song using pipeline module.
		 */
		async processSong() {
			this.setMode(ControllerMode.Loading);

			await Pipeline.processSong(this.currentSong);

			this.debugLog(
				`Song finished processing: ${this.currentSong.toString()}`);

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
					 * to set song as now playing. We should display
					 * now playing notification, though.
					 */
					if (!this.playbackTimer.isExpired()) {
						this.setSongNowPlaying();
					} else {
						this.showNowPlayingNotification();
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
		unprocessSong() {
			this.debugLog(`Song unprocessed: ${this.currentSong.toString()}`);
			this.debugLog('Clearing playback timer destination time');

			this.currentSong.resetFlags();
			this.currentSong.resetMetadata();

			this.playbackTimer.update(null);
			this.replayDetectionTimer.update(null);
		}

		/**
		 * Called when playing state is changed.
		 * @param {Object} value New playing state
		 */
		onPlayingStateChanged(value) {
			this.debugLog(`isPlaying state changed to ${value}`);

			if (value) {
				this.playbackTimer.resume();
				this.replayDetectionTimer.resume();

				const {	isMarkedAsPlaying } = this.currentSong.flags;

				// Maybe the song was not marked as playing yet
				if (!isMarkedAsPlaying && this.currentSong.isValid()) {
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

		/**
		 * Show now playing notification for current song.
		 */
		showNowPlayingNotification() {
			if (this.currentSong.flags.isReplaying) {
				return;
			}

			Notifications.showNowPlaying(this.currentSong, () => {
				Util.openTab(this.tabId);
			});
		}

		/**
		 * Check if song is changed by given connector state.
		 * @param  {Object} newState Connector state
		 * @return {Boolean} Check result
		 */
		isSongChanged(newState) {
			if (!this.currentSong) {
				return true;
			}

			for (const field of fieldsToCheckSongChange) {
				if (newState[field] !== this.currentSong.parsed[field]) {
					return true;
				}
			}

			return false;
		}

		/**
		 * Check if song duration should be updated.
		 * @param  {Object} newState Connector state
		 * @return {Boolean} Check result
		 */
		isNeedToUpdateDuration(newState) {
			return newState.duration && !this.currentSong.parsed.duration;
		}

		/**
		 * Update song duration value.
		 * @param  {Number} duration Duration in seconds
		 */
		updateSongDuration(duration) {
			this.currentSong.parsed.duration = duration;

			if (this.currentSong.isValid()) {
				this.debugLog(`Update duration: ${duration}`);
				this.updateTimers(duration);
			}
		}

		/**
		 * Update internal timers.
		 * @param  {Number} duration Song duration in seconds
		 */
		async updateTimers(duration) {
			if (this.playbackTimer.isExpired()) {
				this.debugLog('Attempt to update expired timers', 'warn');
				return;
			}

			const percent = await Options.getOption(Options.SCROBBLE_PERCENT);
			const secondsToScrobble = Util.getSecondsToScrobble(duration, percent);

			if (secondsToScrobble !== -1) {
				this.playbackTimer.update(secondsToScrobble);
				this.replayDetectionTimer.update(duration);

				const remainedSeconds = this.playbackTimer.getRemainingSeconds();
				this.debugLog(`The song will be scrobbled in ${remainedSeconds} seconds`);
				this.debugLog(`The song will be repeated in ${duration} seconds`);
			} else {
				this.debugLog('The song is too short to scrobble');
			}
		}

		/**
		 * Contains all actions to be done when song is ready to be marked as
		 * now playing.
		 */
		async setSongNowPlaying() {
			this.currentSong.flags.isMarkedAsPlaying = true;

			const results = await ScrobbleService.sendNowPlaying(this.currentSong);
			if (isAnyResult(results, ServiceCallResult.RESULT_OK)) {
				this.debugLog('Song set as now playing');
				this.setMode(ControllerMode.Playing);
			} else {
				this.debugLog('Song isn\'t set as now playing');
				this.setMode(ControllerMode.Err);
			}

			this.showNowPlayingNotification();
		}

		/**
		 * Notify user that song it not recognized by the extension.
		 */
		setSongNotRecognized() {
			this.setMode(ControllerMode.Unknown);
			Notifications.showSongNotRecognized(() => {
				Util.openTab(this.tabId);
			});
		}

		/**
		 * Called when scrobble timer triggers.
		 * The time should be set only after the song is validated and ready
		 * to be scrobbled.
		 */
		async scrobbleSong() {
			const results = await ScrobbleService.scrobble(this.currentSong);
			if (isAnyResult(results, ServiceCallResult.RESULT_OK)) {
				this.debugLog('Scrobbled successfully');

				this.currentSong.flags.isScrobbled = true;
				this.setMode(ControllerMode.Scrobbled);

				this.onSongUpdated();

				GA.event('core', 'scrobble', this.connector.label);
			} else if (areAllResults(results, ServiceCallResult.RESULT_IGNORE)) {
				this.debugLog('Song is ignored by service');
				this.setMode(ControllerMode.Ignored);
			} else {
				this.debugLog('Scrobbling failed', 'warn');
				this.setMode(ControllerMode.Err);
			}
		}

		reset() {
			this.resetState();
			this.setMode(ControllerMode.Base);
		}

		assertSongIsPlaying() {
			if (!this.currentSong) {
				throw new Error('No song is now playing');
			}
		}

		/**
		 * Print debug message with prefixed tab ID.
		 * @param  {String} text Debug message
		 * @param  {String} logType Log type
		 */
		debugLog(text, logType = 'log') {
			const message = `Tab ${this.tabId}: ${text}`;
			Util.debugLog(message, logType);
		}
	}

	/**
	 * Check if given connector state is empty.
	 * @param  {Object} state Connector state
	 * @return {Boolean} Check result
	 */
	function isStateEmpty(state) {
		return !(state.artist && state.track) && !state.uniqueID && !state.duration;
	}

	/**
	 * Get string representation of given object.
	 * @param  {Object} obj Any object
	 * @return {String} String value
	 */
	function toString(obj) {
		return JSON.stringify(obj, null, 2);
	}

	/**
	 * Check if array of results contains at least one result with given type.
	 * @param  {Array} results Array of results
	 * @param  {String} result Result to check
	 * @return {Boolean} True if at least one good result is found
	 */
	function isAnyResult(results, result) {
		return results.some((r) => r === result);
	}

	/**
	 * Check if array of results contains all results with given type.
	 * @param  {Array} results Array of results
	 * @param  {String} result Result to check
	 * @return {Boolean} True if at least one good result is found
	 */
	function areAllResults(results, result) {
		if (results.length === 0) {
			return false;
		}

		return results.every((r) => r === result);
	}

	return Controller;
});
