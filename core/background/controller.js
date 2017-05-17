'use strict';

define([
	'objects/song',
	'pipeline/pipeline',
	'services/lastfm',
	'pageAction',
	'timer',
	'notifications',
	'services/background-ga',
	'pipeline/local-cache'
], function(Song, Pipeline, LastFM, PageAction, Timer, Notifications, GA, LocalCache) {

	/**
	 * Controller for each tab.
	 *
	 * @constructor
	 * @param {Number} tabId Tab ID
	 * @param {Object} connector Connector match object
	 * @param {Boolean} enabled Flag indicates initial stage
	 */
	return function(tabId, connector, enabled) {

		/**
		 * Number of seconds of playback that is considered to be beginning of the track.
		 * Used for re-play detection.
		 */
		var DEFAULT_START_TIME = 10;

		var pageAction = new PageAction(tabId),
			playbackTimer = new Timer(),
			currentSong = null;

		let isEnabled = true;

		/**
		 * React on state change.
		 * @param {Object} newState State of connector
		 */
		this.onStateChanged = function(newState) {
			if (!isEnabled) {
				return;
			}

			// empty state has same semantics as reset; even if isPlaying, we don't have enough data to use
			var isEmptyState = (!(newState.artist && newState.track) && !newState.uniqueID && !newState.duration);

			if (isEmptyState) {
				// throw away last song and reset state
				if (currentSong !== null) {
					console.log('Tab ' + tabId + ': received empty state - resetting');
					this.resetState();
				}

				// warning for connector developer
				if (newState.isPlaying) {
					console.log('Tab ' + tabId + ': state from connector doesn\'t contain enough information about the playing track: ' + JSON.stringify(newState));
				}

				return;
			}

			//
			// from here on there is at least some song data
			//

			var hasSongChanged = (currentSong === null || newState.artist !== currentSong.parsed.artist || newState.track !== currentSong.parsed.track ||
															newState.album !== currentSong.parsed.album || newState.uniqueID !== currentSong.parsed.uniqueID);

			if (hasSongChanged && !newState.isPlaying) {
				return;
			}

			// flag for current time of song being on its start;
			// uses 5% of song duration if available or fixed interval
			var isNewStateNearStart = (newState.duration !== null && newState.currentTime <= (newState.duration * 0.05)) ||
										(newState.duration === null && newState.currentTime <= DEFAULT_START_TIME);

			// seeking from song's end to its start is treated as a new play;
			// this also covers automatic replaying of the same song over and over
			var isReplayingSong = (!hasSongChanged && currentSong.isNearEnd() && isNewStateNearStart);

			// propagate values that can change without changing the song
			if (!hasSongChanged && !isReplayingSong) {
				if (currentSong && currentSong.flags.isSkipped) {
					return;
				}

				// logging same message over and over saves space in console
				if (newState.isPlaying === currentSong.parsed.isPlaying) {
					console.log('Tab ' + tabId + ': state update: only currentTime has changed');
				} else {
					console.log('Tab ' + tabId + ': state update: ' + JSON.stringify(newState));
				}

				currentSong.parsed.attr({
					currentTime: newState.currentTime,
					isPlaying: newState.isPlaying,
					trackArt: newState.trackArt,
				});

				if (newState.duration && !currentSong.parsed.duration) {
					updateSongDuration(newState.duration);
				}
			} else {
				// we've hit a new song (or replaying the previous one) - clear old data and run processing
				console.log('Tab ' + tabId + ': new track state: ' + JSON.stringify(newState));

				// clear any previous song and its bindings
				this.resetState();

				currentSong = new Song(newState, connector);
				bindSongListeners(currentSong);

				console.log('Tab ' + tabId + ': new ' + (isReplayingSong ? '(replaying) ' : '') + 'song detected: ' + JSON.stringify(currentSong.attr()));

				// start the timer, actual time will be set after processing is done;
				// we can call doScrobble directly, because the timer will be allowed to trigger only after the song is validated
				playbackTimer.start(function() {
					doScrobble(currentSong);
				});

				// if we just detected the track and it's not playing yet, pause the timer right away;
				// this is important, because isPlaying flag binding only calls pause/resume which assumes the timer is started
				if (!newState.isPlaying) {
					playbackTimer.pause();
				}

				// start processing - result will trigger the listener
				processSong(currentSong);
			}
		};

		/**
		 * Update song duration value.
		 * @param  {Number} duration Duration in seconds
		 */
		function updateSongDuration(duration) {
			currentSong.parsed.attr({ duration });

			if (currentSong.flags.isProcessed) {
				playbackTimer.update(currentSong.getSecondsToScrobble());

				let remainedSeconds = playbackTimer.getRemainingSeconds();
				console.log(`Tab ${tabId}: update duration: ${duration}`);
				console.log(`The song will be scrobbled after ${remainedSeconds} more seconds of playback`);
			}
		}

		/**
		 * Setup listeners for new song object.
		 * @param {Object} song Song instance
		 */
		function bindSongListeners(song) {
			/**
			 * Respond to changes of not/playing and pause timer accordingly to get real elapsed time
			 */
			song.bind('parsed.isPlaying', function(ev, newVal) {
				console.log('Tab ' + tabId + ': isPlaying state changed to ' + newVal);

				if (newVal) {
					playbackTimer.resume();

					// maybe the song was not marked as playing yet
					if (!song.flags.isMarkedAsPlaying && (song.flags.isLastfmValid === true || song.flags.isCorrectedByUser === true)) {
						setSongNowPlaying(song);
					}
				} else {
					playbackTimer.pause();
				}
			});

			/**
			 * Song has gone through processing pipeline
			 * This event may occur repeatedly, e.g. when triggered on page load and then corrected by user input
			 */
			song.bind('flags.isProcessed', (ev, newVal) => {
				if (newVal) {
					console.log('Tab ' + tabId + ': song finished processing ', JSON.stringify(song.attr()));
					onProcessed(song);
					chrome.runtime.sendMessage({
						type: 'v2.onSongUpdated',
						data: song.attr(), tabId});
				} else {
					console.log('Tab ' + tabId + ': song un-processed ', JSON.stringify(song.attr()));
					onUnProcessed();
				}
			});
		}

		/**
		 * Unbind all song listener. The song will no longer be used in
		 * Controller, but may remain in async calls and we don't want it
		 * to trigger any more listeners.
		 * @param {Object} song Song instance
		 */
		function unbindSongListeners(song) {
			song.unbind('parsed.isPlaying');
			song.unbind('flags.isProcessed');
		}

		/**
		 * Resets controller state
		 */
		this.resetState = function() {
			pageAction.setSiteSupported();
			playbackTimer.reset();

			if (currentSong !== null) {
				unbindSongListeners(currentSong);
				clearNotification(currentSong);
			}
			currentSong = null;
		};

		/**
		 * Called when song finishes processing in pipeline. It may not have
		 * passed the pipeline successfully, so checks for various flags
		 * are needed.
		 * @param {Object} song Song instance
		 */
		function onProcessed(song) {
			// song is considered valid if either L.FM or the user validated it
			if (song.flags.isLastfmValid === true || song.flags.isCorrectedByUser === true) {
				// processing cleans this flag
				song.flags.attr('isMarkedAsPlaying', false);

				// set time-to-scrobble
				playbackTimer.update(song.getSecondsToScrobble());
				console.log('Tab ' + tabId + ': the song will be scrobbled after ' + playbackTimer.getRemainingSeconds() + ' more seconds of playback');

				// if the song is playing, mark it immediately; otherwise will be flagged in isPlaying binding
				if (song.parsed.isPlaying) {
					setSongNowPlaying(song);
				} else {
					pageAction.setSiteSupported();
				}
			} else {
				setSongNotRecognized();
			}
		}

		/**
		 * Called when song was already flagged as processed, but now is
		 * entering the pipeline again.
		 */
		function onUnProcessed() {
			console.log('Tab ' + tabId + ': clearing playback timer destination time');
			playbackTimer.update(null);
		}

		/**
		 * Contains all actions to be done when song is ready to be marked as
		 * now playing.
		 * @param {Object} song Song instance
		 */
		function setSongNowPlaying(song) {
			Notifications.showPlaying(song);

			// send to L.FM
			var nowPlayingCB = function(result) {
				if (result) {
					console.log(`Tab ${tabId}: song set as now playing)`);
					pageAction.setSongRecognized(song);
				} else {
					console.warn(`Tab ${tabId}: song isn't set as now playing`);
					pageAction.setError();
				}
			};
			LastFM.sendNowPlaying(song, nowPlayingCB);

			song.flags.attr('isMarkedAsPlaying', true);
		}

		/**
		 * Notify user that song it not recognized by the extension.
		 */
		function setSongNotRecognized() {
			pageAction.setSongNotRecognized();
			Notifications.showSongNotRecognized();
		}

		/**
		 * Called when scrobble timer triggers.
		 * The time should be set only after the song is validated and ready
		 * to be scrobbled.
		 * @param {Object} song Song instance
		 */
		function doScrobble(song) {
			console.log('Tab ' + tabId + ': scrobbling song ' + song.getArtist() + ' - ' + song.getTrack());

			var scrobbleCB = function(result) {
				if (result.isOk()) {
					console.info('Tab ' + tabId + ': scrobbled successfully');

					song.flags.attr('isScrobbled', true);
					pageAction.setSongScrobbled(song);

					GA.event('core', 'scrobble', connector.label);
				} else {
					console.error('Tab ' + tabId + ': scrobbling failed');

					pageAction.setError();
				}
			};

			LastFM.scrobble(song, scrobbleCB);
		}

		/**
		 * Process song using pipeline module.
		 * @param {Object} song Song instance
		 * @param {Boolean} forceProcess Force processing for empty songs
		 */
		function processSong(song, forceProcess = false) {
			if (song.isEmpty() && !forceProcess) {
				setSongNotRecognized();
			} else {
				pageAction.setSongLoading(song);
				Pipeline.processSong(song);
			}
		}

		/**
		 * Clear now playing notification for given song.
		 * @param {Object} song Song instance
		 */
		function clearNotification(song) {
			// Remove notification if song was not scrobbled.
			if (!song.flags.isScrobbled) {
				Notifications.remove(song.metadata.notificationId);
			}
		}

		/**
		 * Forward event to PageAction
		 */
		this.onPageActionClicked = function() {
			pageAction.onClicked();
		};

		/**
		 * Get current song as plain object.
		 * @return {Object} Song copy
		 */
		this.getCurrentSong = function() {
			return currentSong === null ? {} : currentSong.attr();
		};

		/**
		 * Sets data for current song from user input
		 * TODO: check if all is ok for case when song is already valid
		 * @param {Object} data Object contains song data
		 */
		this.setUserSongData = function(data) {
			if (currentSong !== null) {
				if (currentSong.flags.isScrobbled) {
					// should not happen
					console.error('Tab ' + tabId + ': attempted to enter user data for already scrobbled song');
					return;
				}

				if (data.artist) {
					currentSong.metadata.attr('userArtist', data.artist);
				}
				if (data.track) {
					currentSong.metadata.attr('userTrack', data.track);
				}
				if (data.album) {
					currentSong.metadata.attr('userAlbum', data.album);
				}

				// re-send song to pipeline
				if (data.artist || data.track || data.album) {
					processSong(currentSong, true);
				}
			}
		};

		/**
		 * Reset song data and process it again.
		 */
		this.resetSongData = function() {
			if (currentSong !== null) {
				currentSong.resetSongData();
				LocalCache.removeSongFromStorage(currentSong, () => {
					processSong(currentSong);
				});
			}
		};

		this.toggleLove = function(data, cb) {
			if (currentSong !== null) {
				LastFM.toggleLove(currentSong, data.shouldBeLoved, function() {
					currentSong.metadata.attr('userloved', data.shouldBeLoved);
					cb();
				});
			}
		};

		/**
		 * Make the controller to ignore current song.
		 */
		this.skipCurrentSong = function() {
			if (!currentSong) {
				return;
			}

			pageAction.setSongSkipped(currentSong);

			currentSong.flags.attr({ isSkipped: true });

			playbackTimer.reset();
			unbindSongListeners(currentSong);
			clearNotification(currentSong);
		};

		/**
		 * Switch the state of controller.
		 * @param {Boolean} flag True means enabled and vice versa
		 */
		this.setEnabled = function(flag) {
			isEnabled = flag;

			if (isEnabled) {
				pageAction.setSiteSupported();
			} else {
				pageAction.setSiteDisabled();
			}

			if (!isEnabled && currentSong) {
				playbackTimer.reset();
				unbindSongListeners(currentSong);
				clearNotification(currentSong);
			}
		};

		/**
		 * Check if controller is enabled.
		 * @return {Boolean} True if controller is enabled; false otherwise
		 */
		this.isEnabled = function() {
			return isEnabled;
		};

		/**
		 * Get connector match object.
		 * @return {Object} Connector
		 */
		this.getConnector = function() {
			return connector;
		};

		// setup initial page action; the controller means the page was recognized
		this.setEnabled(enabled);

		console.log('Tab ' + tabId + ': created controller for connector: ' + JSON.stringify(connector));
	};
});
