type TimerCallback = () => void;

/**
 * Timer object.
 */
export class Timer {
	/**
	 * Target seconds.
	 */
	private targetSeconds: number;

	/**
	 * Start time in seconds.
	 */
	private startedOn: number;

	/**
	 * Pause time in seconds.
	 */
	private pausedOn: number;

	/**
	 * Sum of paused time in seconds.
	 */
	private spentPaused: number;

	/**
	 * Function will be called when the timer is triggered.
	 */
	private callback: TimerCallback;

	/**
	 * Is the timer triggered?
	 */
	private hasTriggered: boolean;

	private timeoutId: NodeJS.Timeout;

	/**
	 * @constructor
	 */
	constructor() {
		this.reset();
	}

	/**
	 * Reset the timer.
	 */
	reset(): void {
		this.targetSeconds = null;
		this.startedOn = null;
		this.pausedOn = null;
		this.spentPaused = 0;
		this.callback = null;
		this.hasTriggered = false;

		this.clearTrigger();
	}

	/**
	 * Set the timer and define trigger callback.
	 *
	 * Use `Timer.update` method to define time to trigger.
	 *
	 * @param cb Function that will be called when timer is triggered
	 */
	start(cb: TimerCallback): void {
		this.reset();
		this.startedOn = now();
		this.callback = cb;
	}

	/**
	 * Pause the timer.
	 */
	pause(): void {
		// only if timer was started and was running
		if (this.startedOn !== null && this.pausedOn === null) {
			this.pausedOn = now();
			this.clearTrigger();
		}
	}

	/**
	 * Unpause the timer.
	 */
	resume(): void {
		// Only if the timer was started and was paused
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
	 * Already elapsed time is not modified and callback will be triggered
	 * immediately if the new time is less than elapsed.
	 *
	 * Pass null to set destination time to 'never' - this prevents the timer
	 * from triggering but still keeps it counting time.
	 *
	 * Intentionally does not check if the callback was already triggered.
	 * This allows to update the timer after it went out once and still
	 * be able to properly trigger the callback for the new timeout.
	 *
	 * @param seconds Seconds
	 */
	update(seconds: number): void {
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
	 * Return seconds passed from the timer was started.
	 * Time spent paused does not count.
	 *
	 * @return Elapsed seconds
	 */
	getElapsed(): number {
		let val = now() - this.startedOn - this.spentPaused;

		if (this.pausedOn !== null) {
			val -= now() - this.pausedOn;
		}

		return val;
	}

	/**
	 * Return remaining seconds or null if no destination time is set.
	 *
	 * @return Remaining seconds
	 */
	getRemainingSeconds(): number {
		if (this.targetSeconds === null) {
			return null;
		}

		return this.targetSeconds - this.getElapsed();
	}

	/**
	 * Check if the timer is expired. Expired timer has negative remaining time.
	 *
	 * @return Check result
	 */
	isExpired(): boolean {
		const remainingSeconds = this.getRemainingSeconds();
		return remainingSeconds !== null && remainingSeconds < 0;
	}

	/**
	 * Trigger the timer in given seconds.
	 *
	 * @param seconds Seconds
	 */
	private setTrigger(seconds: number): void {
		this.clearTrigger();
		this.timeoutId = setTimeout(() => {
			this.callback();
			this.hasTriggered = true;
		}, seconds * 1000);
	}

	/**
	 * Clear internal timeout.
	 */
	private clearTrigger(): void {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}
		this.timeoutId = null;
	}
}

/**
 * Return current time in seconds.
 *
 * @return Current time in seconds
 */
function now(): number {
	return Math.round(new Date().valueOf() / 1000);
}
