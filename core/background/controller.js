'use strict';

define([
	'objects/song',
	'pipeline/pipeline',
	'pageAction',
	'timer',
	'notifications',
	'services/background-ga',
	'pipeline/local-cache',
	'services/scrobbleService',
	'objects/serviceCallResult',
], function(Song, Pipeline, PageAction, Timer, Notifications, GA, LocalCache, ScrobbleService, ServiceCallResult) {
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

			this.pageAction = new PageAction(tabId);
			this.playbackTimer = new Timer();
			this.replayDetectionTimer = new Timer();

			this.currentSong = null;
			this.isReplayingSong = false;

			this.setEnabled(isEnabled);
			this.debugLog(`Created controller for ${connector.label} connector`);
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
				this.pageAction.setSiteDisabled();
			}

			if (!flag && this.currentSong) {
				this.playbackTimer.reset();
				this.replayDetectionTimer.reset();

				this.unbindSongListeners();
				this.clearNotification();
			}
		}

		/**
		 * Reset controller state.
		 */
		resetState() {
			this.pageAction.setSiteSupported();

			this.playbackTimer.reset();
			this.replayDetectionTimer.reset();

			if (this.currentSong !== null) {
				this.unbindSongListeners();
				this.clearNotification();
			}
			this.currentSong = null;
		}

		/**
		 * Do finalization before unloading controller.
		 */
		finish() {
			this.resetState();
			this.pageAction.hide();
		}

		/**
		 * Reset song data and process it again.
		 */
		resetSongData() {
			if (this.currentSong) {
				this.currentSong.resetSongData();
				LocalCache.removeSongFromStorage(this.currentSong).then(() => {
					this.processSong();
				});
			}
		}

		/**
		 * Make the controller to ignore current song.
		 */
		skipCurrentSong() {
			if (!this.currentSong) {
				return;
			}

			this.pageAction.setSongSkipped(this.currentSong);

			this.currentSong.flags.attr({ isSkipped: true });

			this.playbackTimer.reset();
			this.replayDetectionTimer.reset();

			this.unbindSongListeners();
			this.clearNotification();
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
			return this.currentSong === null ? {} : this.currentSong.attr();
		}

		/**
		 * Sets data for current song from user input
		 * @param {Object} data Object contains song data
		 */
		setUserSongData(data) {
			if (this.currentSong) {
				if (this.currentSong.flags.isScrobbled) {
					// should not happen
					this.debugLog('Attempted to enter user data for already scrobbled song');
					return;
				}

				if (data.artist) {
					this.currentSong.metadata.attr('userArtist', data.artist);
				}
				if (data.track) {
					this.currentSong.metadata.attr('userTrack', data.track);
				}
				if (data.album) {
					this.currentSong.metadata.attr('userAlbum', data.album);
				}

				// re-send song to pipeline
				if (data.artist || data.track || data.album) {
					this.processSong();
				}
			}
		}

		/**
		 * Send request to love or unlove current song.
		 * @param  {Boolean} isLoved Flag indicated song is loved
		 * @return {Promise} Promise that will be resolved when the task has complete
		 */
		toggleLove(isLoved) {
			if (this.currentSong) {
				return ScrobbleService.toggleLove(this.currentSong, isLoved).then(() => {
					this.currentSong.metadata.attr('userloved', isLoved);
				});
			}
			return Promise.reject();
		}

		/**
		 * React on state change.
		 * @param {Object} newState State of connector
		 */
		onStateChanged(newState) {
			if (!this.isEnabled) {
				return;
			}

			// Empty state has same semantics as reset; even if isPlaying,
			// we don't have enough data to use.
			if (isStateEmpty(newState)) {
				// throw away last song and reset state
				if (this.currentSong) {
					this.debugLog('Received empty state - resetting');
					this.resetState();
				}

				// warning for connector developer
				if (newState.isPlaying) {
					this.debugLog(`State from connector doesn't contain enough information about the playing track: ${toString(newState)}`);
				}

				return;
			}

			// From here on there is at least some song data

			let isSongChanged = this.isSongChanged(newState);
			if (isSongChanged && !newState.isPlaying) {
				return;
			}

			// Propagate values that can change without changing the song
			if (!isSongChanged && !this.isReplayingSong) {
				this.processCurrentState(newState);
			} else {
				this.processNewState(newState);
			}
		}

		/** Internal functions */

		/**
		 * Process connector state as new one.
		 * @param {Object} newState Connector state
		 */
		processNewState(newState) {
			// We've hit a new song (or replaying the previous one)
			// clear any previous song and its bindings
			this.resetState();
			this.currentSong = new Song(newState, this.connector);

			this.bindSongListeners({ notify: !this.isReplayingSong });
			this.debugLog(`New song detected: ${toString(newState)}`);

			// Start the timer, actual time will be set after processing
			// is done; we can call doScrobble directly, because the timer
			// will be allowed to trigger only after the song is validated
			this.playbackTimer.start(() => {
				this.scrobbleSong();
			});

			this.replayDetectionTimer.start(() => {
				this.isReplayingSong = true;
			});

			// If we just detected the track and it's not playing yet,
			// pause the timer right away; this is important, because
			// isPlaying flag binding only calls pause/resume which assumes
			// the timer is started
			if (!newState.isPlaying) {
				this.playbackTimer.pause();
				this.replayDetectionTimer.pause();
			}

			// Start processing - result will trigger the listener
			this.processSong();
			this.isReplayingSong = false;
		}

		/**
		 * Process connector state as current one.
		 * @param {Object} newState Connector state
		 */
		processCurrentState(newState) {
			if (this.currentSong && this.currentSong.flags.isSkipped) {
				return;
			}

			this.currentSong.parsed.attr({
				currentTime: newState.currentTime,
				isPlaying: newState.isPlaying,
				trackArt: newState.trackArt,
			});

			if (this.isNeedToUpdateDuration(newState)) {
				this.updateSongDuration(newState.duration);
			}
		}

		/**
		 * Setup listeners for new song object.
		 * @param  {Object} options Options
		 */
		bindSongListeners(options = {}) {
			/**
			 * Respond to changes of not/playing and pause timer accordingly to get real elapsed time
			 */
			this.currentSong.bind('parsed.isPlaying', (ev, isPlaying) => {
				this.debugLog(`isPlaying state changed to ${isPlaying}`);

				if (isPlaying) {
					this.playbackTimer.resume();
					this.replayDetectionTimer.resume();

					// Maybe the song was not marked as playing yet
					if (!this.currentSong.flags.isMarkedAsPlaying && this.currentSong.isValid()) {
						this.setSongNowPlaying(options);
					}
				} else {
					this.playbackTimer.pause();
					this.replayDetectionTimer.pause();
				}
			});

			/**
			 * Song has gone through processing pipeline
			 * This event may occur repeatedly, e.g. when triggered on page load and then corrected by user input
			 */
			this.currentSong.bind('flags.isProcessed', (ev, isProcessed) => {
				if (isProcessed) {
					this.debugLog(`Song finished processing: ${this.currentSong.toString()}`);
					this.onProcessed(options);
					this.notifySongIsUpdated();
				} else {
					this.debugLog(`Song unprocessed: ${this.currentSong.toString()}`);
					this.onUnProcessed();
				}
			});
		}

		/**
		 * Unbind all song listener. The song will no longer be used in
		 * Controller, but may remain in async calls and we don't want it
		 * to trigger any more listeners.
		 */
		unbindSongListeners() {
			this.currentSong.unbind('parsed.isPlaying');
			this.currentSong.unbind('flags.isProcessed');
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
		 * @param  {Object} options Options
		 */
		onProcessed(options = {}) {
			// Song is considered valid if either L.FM or the user validated it
			if (this.currentSong.isValid()) {
				// Processing cleans this flag
				this.currentSong.flags.attr('isMarkedAsPlaying', false);

				// Set time-to-scrobble
				this.playbackTimer.update(this.currentSong.getSecondsToScrobble());
				this.replayDetectionTimer.update(this.currentSong.getDuration());

				let remainedSeconds = this.playbackTimer.getRemainingSeconds();
				this.debugLog(`The song will be scrobbled in ${remainedSeconds} seconds`);

				// If the song is playing, mark it immediately; otherwise will be flagged in isPlaying binding
				if (this.currentSong.parsed.isPlaying) {
					this.setSongNowPlaying(options);
				} else {
					this.pageAction.setSiteSupported();
				}
			} else {
				this.setSongNotRecognized();
			}
		}

		/**
		 * Called when song was already flagged as processed, but now is
		 * entering the pipeline again.
		 */
		onUnProcessed() {
			this.debugLog('Clearing playback timer destination time');

			this.playbackTimer.update(null);
			this.replayDetectionTimer.update(null);
		}

		/**
		 * Clear now playing notification for given song.
		 */
		clearNotification() {
			// Remove notification if song was not scrobbled.
			if (!this.currentSong.flags.isScrobbled) {
				Notifications.remove(this.currentSong.metadata.notificationId);
			}
		}

		/**
		 * Notify other modules song is updated.
		 */
		notifySongIsUpdated() {
			chrome.runtime.sendMessage({
				type: 'v2.songUpdated',
				data: this.currentSong.attr(),
				tabId: this.tabId
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
			return newState.artist !== this.currentSong.parsed.artist ||
				newState.uniqueID !== this.currentSong.parsed.uniqueID ||
				newState.track !== this.currentSong.parsed.track ||
				newState.album !== this.currentSong.parsed.album;
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
			this.currentSong.parsed.attr({ duration });

			if (this.currentSong.isValid()) {
				this.playbackTimer.update(this.currentSong.getSecondsToScrobble());
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
		setSongNowPlaying({ notify = true } = {}) {
			ScrobbleService.sendNowPlaying(this.currentSong).then((results) => {
				if (isAnyResult(results, ServiceCallResult.OK)) {
					this.debugLog('Song set as now playing');
					this.pageAction.setSongRecognized(this.currentSong);
				} else {
					this.debugLog('Song isn\'t set as now playing');
					this.pageAction.setError();
				}

				if (notify) {
					Notifications.showPlaying(this.currentSong);
				}
			});

			this.currentSong.flags.attr('isMarkedAsPlaying', true);
		}

		/**
		 * Notify user that song it not recognized by the extension.
		 */
		setSongNotRecognized() {
			this.pageAction.setSongNotRecognized();
			Notifications.showSongNotRecognized();
		}

		/**
		 * Called when scrobble timer triggers.
		 * The time should be set only after the song is validated and ready
		 * to be scrobbled.
		 */
		scrobbleSong() {
			ScrobbleService.scrobble(this.currentSong).then((results) => {
				if (isAnyResult(results, ServiceCallResult.OK)) {
					this.debugLog('Scrobbled successfully');

					this.currentSong.flags.attr('isScrobbled', true);
					this.pageAction.setSongScrobbled(this.currentSong);

					this.notifySongIsUpdated();

					GA.event('core', 'scrobble', this.connector.label);
				} else if (areAllResults(results, ServiceCallResult.IGNORED)) {
					this.debugLog('Song is ignored by service');
					this.pageAction.setSongIgnored(this.currentSong);
				} else {
					this.debugLog('Scrobbling failed', 'warn');

					this.pageAction.setError();
				}
			});
		}

		/**
		 * Pring debug message with prefixed tab ID.
		 * @param  {String} text Debug message
		 * @param  {String} type Log type
		 */
		debugLog(text, type = 'log') {
			let message = `Tab ${this.tabId}: ${text}`;

			switch (type) {
				case 'log':
					console.log(message);
					break;
				case 'warn':
					console.warn(message);
					break;
				case 'error':
					console.error(message);
					break;
			}
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
