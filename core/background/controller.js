'use strict';

/**
 * Controller for each tab
 */
define([
	'objects/song',
	'pipeline/pipeline',
	'services/lastfm',
	'pageAction',
	'timer',
	'notifications',
	'services/background-ga'
], function(Song, Pipeline, LastFM, PageAction, Timer, Notifications, GA) {

	/**
	 * Constructor
	 *
	 * @param {Number} tabId
	 * @param {Object} connector
	 */
	return function(tabId, connector) {

		/**
		 * Number of seconds of playback before the track is scrobbled.
		 * This value is used only if no duration was parsed or loaded
		 */
		var DEFAULT_SCROBBLE_TIME = 30;

		/**
		 * Number of seconds of playback that is considered to be beginning of the track.
		 * Used for re-play detection.
		 */
		var DEFAULT_START_TIME = 10;

		var pageAction = new PageAction(tabId),
			playbackTimer = new Timer(),
			currentSong = null;



		/**
		 * React on state change
		 * @param {Object} newState
		 */
		this.onStateChanged = function(newState) {

			// empty state has same semantics as reset; even if isPlaying, we have no data to use
			var isEmptyState = (!newState.artist && !newState.track && !newState.uniqueID && !newState.duration);

			if (isEmptyState) {
				// throw away last song and reset state
				if (currentSong !== null) {
					console.log('Tab ' + tabId + ': received empty state - resetting');
					resetState();
				}

				// warning for connector developer
				if (newState.isPlaying) {
					console.log('Tab ' + tabId + ': state from connector is missing any information about the playing track: ' + JSON.stringify(newState));
				}

				return;
			}

			//
			// from here on there is at least some song data
			//

			var hasSongChanged = (currentSong === null || newState.artist !== currentSong.parsed.artist || newState.track !== currentSong.parsed.track ||
															newState.album !== currentSong.parsed.album || newState.uniqueID !== currentSong.parsed.uniqueID);

			// flag for current time of song being on its start;
			// uses 5% of song duration if available or fixed interval
			var isNewStateNearStart = (newState.duration !== null && newState.currentTime <= (newState.duration * 0.05)) ||
										(newState.duration === null && newState.currentTime <= DEFAULT_START_TIME);

			// seeking from song's end to its start is treated as a new play;
			// this also covers automatic replaying of the same song over and over
			var isReplayingSong = (!hasSongChanged && currentSong.isNearEnd() && isNewStateNearStart);

			// propagate values that can change without changing the song
			if (!hasSongChanged && !isReplayingSong) {
				// logging same message over and over saves space in console
				if (newState.isPlaying == currentSong.parsed.isPlaying) {
					console.log('Tab ' + tabId + ': state update: only currentTime has changed');
				} else {
					console.log('Tab ' + tabId + ': state update: ' + JSON.stringify(newState));
				}

				currentSong.parsed.attr({
					currentTime: newState.currentTime,
					isPlaying: newState.isPlaying
				});
			}
			// we've hit a new song (or replaying the previous one) - clear old data and run processing
			else {
				console.log('Tab ' + tabId + ': new track state: ' + JSON.stringify(newState));

				// clear any previous song and its bindings
				resetState();

				currentSong = new Song(newState);
				bindSongListeners(currentSong);

				console.log('Tab ' + tabId + ': new ' + (isReplayingSong ? '(replaying) ' : '') + 'song detected: ' + JSON.stringify(currentSong.attr()));

				// set timer to parsed duration or use default;
				// the timer is later optionally updated with loaded metadata
				//
				// this call starts timer and also resets any previously set timer
				var destSeconds = Math.floor(currentSong.parsed.duration / 2) || DEFAULT_SCROBBLE_TIME;
				playbackTimer.start(destSeconds, function() {
					onTimer(currentSong);
				});
				console.log('Tab ' + tabId + ': timer started for ' + destSeconds);

				// start processing - result will trigger the listener
				Pipeline.processSong(currentSong);
			}
		};

		/**
		 * Setup listeners for new song object
		 * @param {Song} song
		 */
		function bindSongListeners(song) {
			/**
			 * Respond to changes of not/playing and pause timer accordingly to get real elapsed time
			 */
			song.bind('parsed.isPlaying', function(ev, newVal) {
				console.log('Tab ' + tabId + ': isPlaying state changed to ' + newVal);

				if (newVal) {
					playbackTimer.resume();
				} else {
					playbackTimer.pause();
				}
			});

			/**
			 * Song has gone through processing pipeline
			 */
			song.bind('flags.isProcessed', function(ev, newVal) {
				if (newVal) {
					console.log('Tab ' + tabId + ': song finished processing ', JSON.stringify(song.attr()));
					onProcessed(song);
				}
			});
		}

		/**
		 * Unbind all song listener. The song will no longer be used in Controller, but may
		 * remain in async calls and we don't want it to trigger any more listeners.
		 * @param {Song} song
		 */
		function unbindSongListeners(song) {
			song.unbind('parsed.isPlaying');
			song.unbind('flags.isProcessed');
		}

		/**
		 * Resets controller state
		 */
		function resetState() {
			pageAction.setSiteSupported();
			playbackTimer.reset();

			if (currentSong !== null) {
				unbindSongListeners(currentSong);

				// remove notification if song was not scrobbled
				if (!currentSong.flags.isScrobbled) {
					Notifications.remove(currentSong.metadata.notificationId);
				}
			}
			currentSong = null;
		}

		/**
		 * Called when song finishes processing in pipeline. It may not have passed the pipeline
		 * successfully, so checks for various flags are needed.
		 * @param {Song} song
		 */
		function onProcessed(song) {
			// currently supporting only L.FM valid songs;
			// in future manually corrected songs will be stored in cache and sent too
			if (song.flags.isLastfmValid === true) {
				// set timer for new value if not parsed before and if loaded any duration
				if (!song.parsed.duration && song.processed.duration && playbackTimer !== null) {
					var halfTime = Math.floor(song.processed.duration / 2);
					playbackTimer.update(halfTime);
					console.log('Tab ' + tabId + ': timer updated to ' + halfTime);
				}

				setSongNowPlaying(song);
			} else {
				pageAction.setSongNotRecognized();
			}
		}

		/**
		 * Contains all actions to be done when song is ready to be marked as now playing
		 * @param {Song} song
		 */
		function setSongNowPlaying(song) {
			pageAction.setSongRecognized(song);

			Notifications.showPlaying(song);

			// send to L.FM
			var nowPlayingCB = function(success) {
				console.log('Tab ' + tabId + ': song set as now playing: ' + success);
			};
			LastFM.sendNowPlaying(song, nowPlayingCB);
		}


		/**
		 * Called when scrobble timer triggers
		 */
		function onTimer(song) {
			console.log('Tab ' + tabId + ': scrobbling song');

			var scrobbleCB = function(result) {
				if (result.isOk()) {
					console.info('Tab ' + tabId + ': scrobbled successfully');

					song.flags.attr('isScrobbled', true);
					pageAction.setSongScrobbled(song);

					GA.event('core', 'scrobble', connector.label);
				} else {
					console.error('Tab ' + tabId + ': scrobbling failed');
				}
			};

			// scrobble only if the song is valid (TODO: or corrected by user)
			if (song.flags.isLastfmValid === true) {
				LastFM.scrobble(song, scrobbleCB);
			} else {
				console.log('Tab ' + tabId + ': not scrobbling song with incomplete data');
			}
		}

		/**
		 * Forward event to PageAction
		 */
		this.onPageActionClicked = function() {
			pageAction.onClicked();
		};

		/**
		 * Returns current song as plain object (not can.Map)
		 * @return {{}}
		 */
		this.getCurrentSong = function() {
			return currentSong === null ? {} : currentSong.attr();
		};

		/**
		 * Sets data for current song from user input
		 * TODO: check if all is ok for case when song is already valid
		 */
		this.setUserSongData = function(data) {
			if (currentSong !== null) {
				if (data.artist) {
					currentSong.metadata.attr('userArtist', data.artist);
				}
				if (data.track) {
					currentSong.metadata.attr('userTrack', data.track);
				}

				// re-send song to pipeline
				if (data.artist || data.track) {
					Pipeline.processSong(currentSong);
				}
			}
		};

		//
		//
		// Active calls
		//
		//

		// setup initial page action; the controller means the page was recognized
		pageAction.setSiteSupported();

		console.log('Tab ' + tabId + ': created controller for connector: ' + JSON.stringify(connector));
	};

});
