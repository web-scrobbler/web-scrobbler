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

		var pageAction = new PageAction(tabId),
			playbackTimer = null,
			currentSong = null;



		/**
		 * React on state change
		 * @param {Object} newState
		 */
		this.onStateChanged = function(newState) {
			// don't trust the connector
			if (!newState.artist || !newState.track) {

				if (currentSong !== null) {
					console.log('Tab ' + tabId + ': state from connector is missing artist or track property: ' + JSON.stringify(newState));

					pageAction.setSiteSupported();
					playbackTimer.reset();

					unbindSongListeners(currentSong);
					currentSong = null;
				}

				return;
			}

			var hasSongChanged = (currentSong === null ||
									newState.artist !== currentSong.parsed.artist || newState.track !== currentSong.parsed.track ||
									newState.album !== currentSong.parsed.album || newState.uniqueID !== currentSong.parsed.uniqueID);

			// propagate values that can change without changing the song
			if (!hasSongChanged) {
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
			// we've hit a new song - clear old data and run processing
			else {
				console.log('Tab ' + tabId + ': new track state: ' + JSON.stringify(newState));

				// unbind previous song, so possible delayed changes don't trigger any event
				if (currentSong !== null) {
					unbindSongListeners(currentSong);
				}

				currentSong = new Song(newState);
				bindSongListeners(currentSong);

				console.log('Tab ' + tabId + ': new song detected, ' + JSON.stringify(currentSong.attr()));

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

					pageAction.setSongScrobbled(song);

					GA.event('core', 'scrobble', connector.label);
				} else {
					console.error('Tab ' + tabId + ': scrobbling failed');
				}
			};
			LastFM.scrobble(song, scrobbleCB);
		}

		/**
		 * Forward event to PageAction
		 */
		this.onPageActionClicked = function() {
			pageAction.onClicked();
		};


		//
		//
		// Active calls
		//
		//


		// create timer
		playbackTimer = new Timer();

		// setup initial page action; the controller means the page was recognized
		pageAction.setSiteSupported();

		console.log('Tab ' + tabId + ': created controller for connector: ' + JSON.stringify(connector));
	};

});
