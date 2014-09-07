'use strict';

/**
 * Controller for each tab
 */
define([
	'services/lastfm',
	'pageAction',
	'helpers',
	'timer',
	'wrappers/can'
], function(LastFM, PageAction, Helpers, Timer, can) {

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
			currentSong = Helpers.createEmptySong();

		/**
		 * Counters for CanJS batch updates. Properties changed in a single batch
		 * trigger multiple events, but share the batch number. By knowing it we
		 * can respond only one time per batch
		 *
		 * @see http://canjs.com/docs/can.batch.html
		 */
		var batchNumbers = {
			attemptedLFMValidation: null
		};



		/**
		 * React on state change
		 * @param {Object} newState
		 */
		this.onStateChanged = function(newState) {
			console.log('Tab ' + tabId + ': state changed, ' + JSON.stringify(newState));

			var hasSongChanged = (newState.artist !== currentSong.artist || newState.track !== currentSong.track ||
									newState.album !== currentSong.album || newState.uniqueID !== currentSong.uniqueID);

			// song property changed listeners will be called will not be called until batch ends
			can.batch.start();

			// propagate new values to current song
			currentSong.attr({
				artist: newState.artist,
				track: newState.track,
				album: newState.album,
				uniqueID: newState.uniqueID,
				duration: newState.duration,
				currentTime: newState.currentTime,
				isPlaying: newState.isPlaying
			});

			// clear old data and run validation the first time we see a new song
			if (hasSongChanged) {
				currentSong.attr({
					isLFMValid: false,
					attemptedLFMValidation: false
				});

				currentSong.metadata.attr({
					artist: null,
					track: null,
					duration: null,
					artistThumbUrl: null
				});

				console.log('Tab ' + tabId + ': new song detected, ' + JSON.stringify(currentSong.attr()));

				// set timer to parsed duration or use default;
				// the timer is later optionally updated with loaded metadata
				//
				// this call starts timer and also resets any previously set timer
				var destSeconds = Math.floor(currentSong.duration / 2) || DEFAULT_SCROBBLE_TIME;
				playbackTimer.start(destSeconds);
				console.log('Tab ' + tabId + ': timer started for ' + destSeconds);

				// run LFM validation which will update song's attemptedLFMValidation flag
				LastFM.loadSongInfo(currentSong);
			}

			// commit batch - song property changed listeners will be called
			can.batch.stop();
		};

		/**
		 * Called when scrobble timer triggers
		 */
		this.onTimer = function() {
			console.info('Timer goes on! Should scrobble now...');
		};

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


		/**
		 * Respond to validation of parsed song data
		 */
		currentSong.bind('attemptedLFMValidation', function(ev, newVal) {
			if (!ev.batchNum || ev.batchNum !== batchNumbers.attemptedLFMValidation) {
				batchNumbers.attemptedLFMValidation = ev.batchNum;

				if (newVal === true) {
					console.log('Tab ' + tabId + ': after LFM validation: ' + JSON.stringify(currentSong.attr()));

					if (currentSong.isLFMValid === true) { // metadata loaded successfully
						pageAction.setSongRecognized(currentSong);

						// set timer for new value if not parsed before
						if (!currentSong.duration) {
							var halfTime = Math.floor(currentSong.metadata.duration / 2);
							playbackTimer.update(halfTime);
							console.log('Tab ' + tabId + ': timer updated to ' + halfTime);
						}

						// set the song as now playing
						var nowPlayingCB = function(success) {
							console.log('Tab ' + tabId + ': song set as now playing: ' + success);
						};
						LastFM.sendNowPlaying(currentSong, nowPlayingCB);
					} else {
						pageAction.setSongNotRecognized();
					}
				} else {
					pageAction.setSiteSupported();
				}
			}
		});

		/**
		 * Respond to changes of not/playing and pause timer accordingly to get real elapsed time
		 */
		currentSong.bind('isPlaying', function(ev, newVal) {
			console.log('Tab ' + tabId + ': isPlaying state changed to ' + newVal);

			if (newVal) {
				playbackTimer.resume();
			} else {
				playbackTimer.pause();
			}
		});



		// create timer
		playbackTimer = new Timer(this.onTimer);

		// setup initial page action; the controller means the page was recognized
		pageAction.setSiteSupported();

		console.log('Tab ' + tabId + ': created controller for connector: ' + JSON.stringify(connector));
	};

});
