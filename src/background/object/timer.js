/**
 * Timer object.
 */
export default class Timer {
	/**
	 * @constructor
	 */
	constructor() {
		this.reset();
	}

	/**
	 * Reset timer.
	 */
	reset() {
		/**
		 * Target seconds.
		 * @type {Number}
		 */
		this.targetSeconds = null;

		/**
		 * Start time in seconds.
		 * @type {Number}
		 */
		this.startedOn = null;

		/**
		 * Pause time in seconds.
		 * @type {Number}
		 */
		this.pausedOn = null;

		/**
		 * Sum of paused time in seconds.
		 * @type {Number}
		 */
		this.spentPaused = 0;

		/**
		 * Function will be called when timer is triggered.
		 * @type {Function}
		 */
		this.callback = null;

		/**
		 * Is timer triggered.
		 * @type {Boolean}
		 */
		this.hasTriggered = false;

		this.clearTrigger();
	}

	/**
	 * Set timer and define trigger callback.
	 * Use update function to define time to trigger.
	 *
	 * @param {Function} cb Function that will be called when timer is triggered
	 */
	start(cb) {
		this.reset();
		this.startedOn = now();
		this.callback = cb;
	}

	/**
	 * Pause timer.
	 */
	pause() {
		// only if timer was started and was running
		if (this.startedOn !== null && this.pausedOn === null) {
			this.pausedOn = now();
			this.clearTrigger();
		}
	}

	/**
	 * Unpause timer.
	 */
	resume() {
		// only if timer was started and was paused
		if (this.startedOn !== null && this.pausedOn !== null) {
			this.spentPaused += now() - this.pausedOn;
			this.pausedOn = null;

			if (!this.hasTriggered && this.targetSeconds !== null) {
				this.setTrigger(this.targetSeconds - this.getElapsed());
			}
		}
	}

	/**
	 * Update time for this timer before callback is triggered.
	 * Already elapsed time is not modified and callback
	 * will be triggered immediately if the new time is less than elapsed.
	 *
	 * Pass null to set destination time to 'never' - this prevents the timer
	 * from triggering but still keeps it counting time.
	 *
	 * Intentionally does not check if the callback was already triggered.
	 * This allows to update the timer after it went out once and still
	 * be able to properly trigger the callback for the new timeout.
	 *
	 * @param {Number} seconds Seconds
	 */
	update(seconds) {
		// only if timer was started
		if (this.startedOn !== null) {
			this.targetSeconds = seconds;

			if (seconds !== null) {
				if (this.pausedOn === null) {
					this.setTrigger(this.targetSeconds - this.getElapsed());
				}
			} else {
				this.clearTrigger();
			}
		}
	}

	/**
	 * Return remaining seconds or null if no destination time is set.
	 *
	 * @return {Number} Remaining seconds
	 */
	getRemainingSeconds() {
		if (this.targetSeconds === null) {
			return null;
		}

		return this.targetSeconds - this.getElapsed();
	}

	/**
	 * Check if timer is expired. Expired timer has negative remaining time.
	 *
	 * @return {Boolean} Check result
	 */
	isExpired() {
		const remainingSeconds = this.getRemainingSeconds();
		return remainingSeconds !== null && remainingSeconds < 0;
	}

	/* Internal functions. */

	/**
	 * Trigger timer in given seconds.
	 *
	 * @param {Number} seconds Seconds
	 */
	setTrigger(seconds) {
		this.clearTrigger();
		this.timeoutId = setTimeout(() => {
			this.callback();
			this.hasTriggered = true;
		}, seconds * 1000);
	}

	/**
	 * Clear internal timeout.
	 */
	clearTrigger() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}
		this.timeoutId = null;
	}

	/**
	 * Return seconds passed from the timer was started.
	 * Time spent paused does not count.
	 *
	 * @return {Number} Elapsed seconds
	 */
	getElapsed() {
		let val = now() - this.startedOn - this.spentPaused;

		if (this.pausedOn !== null) {
			val -= now() - this.pausedOn;
		}

		return val;
	}
}

/**
 * Return current time in seconds.
 * @return {Number} Current time in seconds
 */
function now() {
	return Math.round(new Date().valueOf() / 1000);
}
