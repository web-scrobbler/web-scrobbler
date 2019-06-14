'use strict';

define((require) => {
	const GA = require('service/ga');
	const Util = require('util/util');
	const Song = require('object/song');
	const Timer = require('object/timer');
	const Pipeline = require('pipeline/pipeline');
	const Notifications = require('browser/notifications');
	const BrowserAction = require('browser/browser-action');
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
	 * Number of seconds of playback before the track is scrobbled.
	 * This value is used only if no duration was parsed or loaded.
	 */
	const DEFAULT_SCROBBLE_TIME = 30;

	/**
	 * Minimum number of seconds of scrobbleable track.
	 */
	const MIN_TRACK_DURATION = 30;

	/**
	 * Max number of seconds of playback before the track is scrobbled.
	 */
	const MAX_SCROBBLE_TIME = 240;

	/**
	 * Now playing notification delay in milliseconds.
	 */
	const NOW_PLAYING_NOTIFICATION_DELAY = 5000;

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

			this.pageAction = new BrowserAction(tabId);
			this.playbackTimer = new Timer();
			this.replayDetectionTimer = new Timer();

			this.currentSong = null;
			this.isReplayingSong = false;

			this.setEnabled(isEnabled);
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
				this.pageAction.setSiteSupported();
			} else {
				this.resetState();

				this.pageAction.setSiteDisabled();
			}
		}

		/**
		 * Reset controller state.
		 */
		resetState() {
			this.playbackTimer.reset();
			this.replayDetectionTimer.reset();

			if (this.currentSong !== null) {
				this.clearNowPlayingNotification();
			}
			this.currentSong = null;
		}

		/**
		 * Do finalization before unloading controller.
		 */
		finish() {
			this.resetState();
		}

		/**
		 * Reset song data and process it again.
		 */
		async resetSongData() {
			if (this.currentSong) {
				this.currentSong.resetSongData();
				await LocalCacheStorage.removeSongData(this.currentSong);
				this.processSong();
			}
		}

		/**
		 * Make the controller to ignore current song.
		 */
		skipCurrentSong() {
			if (!this.currentSong) {
				throw new Error('No song is now playing');
			}

			this.pageAction.setSongSkipped(this.currentSong);

			this.currentSong.flags.isSkipped = true;

			this.playbackTimer.reset();
			this.replayDetectionTimer.reset();

			this.clearNowPlayingNotification();
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
			return this.currentSong === null ? {} : this.currentSong.getCloneableData();
		}

		/**
		 * Sets data for current song from user input
		 * @param {Object} data Object contains song data
		 */
		async setUserSongData(data) {
			if (!this.currentSong) {
				throw new Error('No song is now playing');
			}

			if (this.currentSong.flags.isScrobbled) {
				this.debugLog('Attempted to enter user data for already scrobbled song', 'warn');
				return;
			}

			if (isSongDataChanged(this.currentSong, data)) {
				await LocalCacheStorage.saveSongData(this.currentSong, data);
				await this.processSong();
			}
		}

		/**
		 * Send request to love or unlove current song.
		 * @param  {Boolean} isLoved Flag indicated song is loved
		 */
		async toggleLove(isLoved) {
			if (!this.currentSong) {
				throw new Error('No song is now playing');
			}

			await ScrobbleService.toggleLove(this.currentSong, isLoved);
			this.currentSong.setLoveStatus(isLoved);
		}

		/**
		 * Called if current song is updated.
		 * @param  {Object} song Updated song
		 */
		// eslint-disable-next-line no-unused-vars
		onSongUpdated(song) {
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

					this.pageAction.setSiteSupported();
					this.resetState();
				}

				if (newState.isPlaying) {
					this.debugLog(`State from connector doesn't contain enough information about the playing track: ${toString(newState)}`, 'warn');
				}

				return;
			}

			let isSongChanged = this.isSongChanged(newState);

			if (!isSongChanged && !this.isReplayingSong) {
				this.processCurrentState(newState);
			} else if (newState.isPlaying) {
				this.processNewState(newState);
			}
		}

		/** Internal functions */

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
			this.currentSong = Song.buildFrom(
				newState, this.connector, this.onSongDataChanged.bind(this)
			);
			this.currentSong.flags.isReplaying = this.isReplayingSong;

			this.debugLog(`New song detected: ${toString(newState)}`);

			/*
			 * Start the timer, actual time will be set after processing
			 * is done; we can call doScrobble directly, because the timer
			 * will be allowed to trigger only after the song is validated.
			 */
			this.playbackTimer.start(() => {
				this.scrobbleSong();
			});

			this.replayDetectionTimer.start(() => {
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

			this.currentSong.parsed.currentTime = newState.currentTime;
			this.currentSong.parsed.isPlaying = newState.isPlaying;
			this.currentSong.parsed.trackArt = newState.trackArt;

			if (this.isNeedToUpdateDuration(newState)) {
				this.updateSongDuration(newState.duration);
			}
		}

		/**
		 * Process song info change.
		 * @param {Object} target Target object
		 * @param {Object} key Property name
		 * @param {Object} value Property value
		 */
		onSongDataChanged(target, key, value) {
			switch (key) {
				/**
				 * Respond to changes of not/playing and pause timer
				 * accordingly to get real elapsed time.
				 */
				case 'isPlaying': {
					this.onPlayingStateChanged(value);
					break;
				}

				/**
				 * Song has gone through processing pipeline
				 * This event may occur repeatedly, e.g. when triggered on
				 * page load and then corrected by user input.
				 */
				case 'isProcessed': {
					value ? this.onProcessed() : this.onUnprocessed();
					break;
				}
			}
		}

		/**
		 * Process song using pipeline module.
		 */
		processSong() {
			this.pageAction.setSongLoading(this.currentSong);
			Pipeline.processSong(this.currentSong);
		}

		/**
		 * Called when song finishes processing in pipeline. It may not have
		 * passed the pipeline successfully, so checks for various flags
		 * are needed.
		 */
		onProcessed() {
			this.debugLog(
				`Song finished processing: ${this.currentSong.toString()}`);

			if (this.currentSong.isValid()) {
				// Processing cleans this flag
				this.currentSong.flags.isMarkedAsPlaying = false;

				let secondsToScrobble = this.getSecondsToScrobble();
				let songDuration = this.currentSong.getDuration();

				if (secondsToScrobble !== -1) {
					this.playbackTimer.update(secondsToScrobble);
					this.replayDetectionTimer.update(songDuration);

					const remainedSeconds = this.playbackTimer.getRemainingSeconds();
					this.debugLog(`The song will be scrobbled in ${remainedSeconds} seconds`);
				} else {
					this.debugLog('The song is too short to scrobble');
				}

				/*
				 * If the song is playing, mark it immediately;
				 * otherwise will be flagged in isPlaying binding.
				 */
				if (this.currentSong.parsed.isPlaying) {
					/*
					 * If playback timer is expired, then the extension
					 * will scrobble song immediately, and there's no need
					 * to set song as now playing.
					 */
					if (!this.playbackTimer.isExpired()) {
						this.setSongNowPlaying();
					}

					this.showNowPlayingNotification();
				} else {
					this.pageAction.setSiteSupported();
				}
			} else {
				this.setSongNotRecognized();
			}

			this.onSongUpdated(this.currentSong);
		}

		/**
		 * Called when song was already flagged as processed, but now is
		 * entering the pipeline again.
		 */
		onUnprocessed() {
			this.debugLog(`Song unprocessed: ${this.currentSong.toString()}`);
			this.debugLog('Clearing playback timer destination time');

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

				// Maybe the song was not marked as playing yet
				if (!this.currentSong.flags.isMarkedAsPlaying
					&& this.currentSong.isValid()) {
					this.setSongNowPlaying();
					this.showNowPlayingNotification();
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

			this.clearNotificationTimeout();

			this.notificationTimeoutId = setTimeout(() => {
				Notifications.showNowPlaying(this.currentSong, () => {
					Util.openTab(this.tabId);
				});
			}, NOW_PLAYING_NOTIFICATION_DELAY);
		}

		/**
		 * Clear now playing notification for current song.
		 */
		clearNowPlayingNotification() {
			Notifications.remove(this.currentSong.metadata.notificationId);

			this.clearNotificationTimeout();
		}

		/**
		 * Clear notification timeout.
		 */
		clearNotificationTimeout() {
			if (this.notificationTimeoutId) {
				clearTimeout(this.notificationTimeoutId);
				this.notificationTimeoutId = null;
			}
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
				let secondsToScrobble = this.getSecondsToScrobble();
				if (secondsToScrobble === -1) {
					return;
				}

				this.playbackTimer.update(this.getSecondsToScrobble());
				this.replayDetectionTimer.update(this.currentSong.getDuration());

				let remainedSeconds = this.playbackTimer.getRemainingSeconds();
				this.debugLog(`Update duration: ${duration}`);
				this.debugLog(`The song will be scrobbled in ${remainedSeconds} seconds`);
			}
		}

		/**
		 * Contains all actions to be done when song is ready to be marked as
		 * now playing.
		 */
		async setSongNowPlaying() {
			this.currentSong.flags.isMarkedAsPlaying = true;

			let results = await ScrobbleService.sendNowPlaying(this.currentSong);
			if (isAnyResult(results, ServiceCallResult.OK)) {
				this.debugLog('Song set as now playing');
				this.pageAction.setSongRecognized(this.currentSong);
			} else {
				this.debugLog('Song isn\'t set as now playing');
				this.pageAction.setError();
			}
		}

		/**
		 * Notify user that song it not recognized by the extension.
		 */
		setSongNotRecognized() {
			this.pageAction.setSongNotRecognized();
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
			let results = await ScrobbleService.scrobble(this.currentSong);
			if (isAnyResult(results, ServiceCallResult.OK)) {
				this.debugLog('Scrobbled successfully');

				this.currentSong.flags.isScrobbled = true;
				this.pageAction.setSongScrobbled(this.currentSong);

				this.onSongUpdated(this.currentSong);

				GA.event('core', 'scrobble', this.connector.label);
			} else if (areAllResults(results, ServiceCallResult.IGNORED)) {
				this.debugLog('Song is ignored by service');
				this.pageAction.setSongIgnored(this.currentSong);
			} else {
				this.debugLog('Scrobbling failed', 'warn');

				this.pageAction.setError();
			}
		}

		/**
		 * Return total number of seconds of playback needed for this track
		 * to be scrobbled.
		 * @return {Number} Seconds to scrobble
		 */
		getSecondsToScrobble() {
			let duration = this.currentSong.getDuration();
			if (duration && duration < MIN_TRACK_DURATION) {
				return -1;
			}

			let scrobbleTime;
			if (duration) {
				scrobbleTime = Math.max(duration / 2);
			} else {
				scrobbleTime = DEFAULT_SCROBBLE_TIME;
			}
			return Math.min(scrobbleTime, MAX_SCROBBLE_TIME);
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
	 * Apply user data to given song.
	 * @param  {Object} song Song object
	 * @param  {Object} data User data
	 * @return {Boolean} True if data is applied
	 */
	function isSongDataChanged(song, data) {
		for (let field of Song.USER_FIELDS) {
			if (data[field]) {
				return true;
			}
		}

		return false;
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
	 * @param  {String} type Result type
	 * @return {Boolean} True if at least one good result is found
	 */
	function isAnyResult(results, type) {
		return results.some((result) => result.type === type);
	}

	/**
	 * Check if array of results contains all results with given type.
	 * @param  {Array} results Array of results
	 * @param  {String} type Result type
	 * @return {Boolean} True if at least one good result is found
	 */
	function areAllResults(results, type) {
		if (results.length === 0) {
			return false;
		}

		return results.every((result) => result.type === type);
	}

	return Controller;
});
