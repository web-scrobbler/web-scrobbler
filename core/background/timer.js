'use strict';

define([], function() {

	/**
	 * Timer
	 */
	return function() {

		var callback = null,
			timeoutId = null,
			target = null, // target seconds
			pausedOn = null, // marks pause time in seconds
			startedOn = null, // marks start time in seconds
			spentPaused = 0; // sum of paused time in seconds

		/**
		 * Returns current time in seconds
		 */
		function now() {
			return Math.round((new Date()).valueOf() / 1000);
		}

		function setTrigger(seconds) {
			clearTrigger();
			timeoutId = setTimeout(callback, seconds * 1000);
		}

		/**
		 * Clears internal timeout
		 */
		function clearTrigger() {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = null;
		}




		/**
		 * Set timer to trigger callback in given seconds.
		 * Time spent paused does not count
		 */
		this.start = function(seconds, cb) {
			this.reset();
			startedOn = now();
			target = seconds;
			callback = cb;
			setTrigger(seconds);
		};

		/**
		 * Pause timer
		 */
		this.pause = function() {
			// only if timer was started and was running
			if (startedOn !== null && pausedOn === null) {
				pausedOn = now();
				clearTrigger();
			}
		};

		/**
		 * Unpause timer
		 */
		this.resume = function() {
			// only if timer was started and was paused
			if (startedOn !== null && pausedOn !== null) {
				spentPaused += now() - pausedOn;
				pausedOn = null;
				setTrigger(target - this.getElapsed());
			}
		};

		/**
		 * Update time for this timer before callback is triggered.
		 * Already elapsed time is not modified and callback
		 * will be triggered immediately if the new time is less than elapsed.
		 */
		this.update = function(seconds) {
			// only if timer was started
			if (startedOn !== null) {
				target = seconds;

				if (pausedOn === null) {
					setTrigger(target - this.getElapsed());
				}
			}
		};

		/**
		 * Returns seconds passed from the timer was started.
		 * Time spent paused does not count
		 */
		this.getElapsed = function() {
			return now() - startedOn - spentPaused;
		};

		/**
		 * Reset timer
		 */
		this.reset = function() {
			target = null;
			startedOn = null;
			pausedOn = null;
			spentPaused = 0;
			callback = null;

			clearTrigger();
		};

	};

});
