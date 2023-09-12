/**
 * Timer object.
 */
export default class Timer {
	private targetSeconds: number | null | undefined = null;
	private startedOn: number | null = null;
	private pausedOn: number | null = null;
	private spentPaused = 0;
	private callback: (() => void) | null = null;
	private hasTriggered = false;
	private timeoutId: number | null = null;

	constructor() {
		this.reset();
	}

	/**
	 * Reset timer.
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
	 * Set timer and define trigger callback.
	 * Use update function to define time to trigger.
	 * @param cb - Function that will be called when timer is triggered
	 */
	start(cb: () => void): void {
		this.reset();
		this.startedOn = now();
		this.callback = cb;
	}

	/**
	 * Pause timer.
	 */
	pause(): void {
		// only if timer was started and was running
		if (this.startedOn !== null && this.pausedOn === null) {
			this.pausedOn = now();
			this.clearTrigger();
		}
	}

	/**
	 * Unpause timer.
	 */
	resume(): void {
		// only if timer was started and was paused
		if (this.startedOn !== null && this.pausedOn !== null) {
			this.spentPaused += now() - this.pausedOn;
			this.pausedOn = null;

			if (
				!this.hasTriggered &&
				this.targetSeconds !== null &&
				this.targetSeconds !== undefined
			) {
				this.setTrigger(this.targetSeconds - this.getElapsed());
			}
		}
	}

	/**
	 * Update time for this timer before callback is triggered.
	 * Already elapsed time is not modified and callback
	 * will be triggered immediately if the new time is less than elapsed.
	 *
	 * Pass null to set destination time to 'never' - this prevents the timer from
	 * triggering but still keeps it counting time.
	 *
	 * Intentionally does not check if the callback was already triggered.
	 * This allows to update the timer after it went out once and still
	 * be able to properly trigger the callback for the new timeout.
	 *
	 * @param seconds - Seconds
	 */
	update(seconds: number | null | undefined): void {
		// only if timer was started
		if (this.startedOn !== null) {
			this.targetSeconds = seconds;

			if (
				this.targetSeconds !== null &&
				this.targetSeconds !== undefined
			) {
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
	 * @returns Remaining seconds
	 */
	getRemainingSeconds(): number | null {
		if (this.targetSeconds === null || this.targetSeconds === undefined) {
			return null;
		}

		return this.targetSeconds - this.getElapsed();
	}

	/**
	 * Check if timer is expired. Expired timer has negative remaining time.
	 * @returns Check result
	 */
	isExpired(): boolean {
		const remainingSeconds = this.getRemainingSeconds();
		return remainingSeconds !== null && remainingSeconds < 0;
	}

	/* Internal functions. */

	/**
	 * Trigger timer in given seconds.
	 * @param seconds - Seconds
	 */
	setTrigger(seconds: number): void {
		this.clearTrigger();
		this.timeoutId = window.setTimeout(() => {
			if (!this.callback) {
				return;
			}
			this.callback();
			this.hasTriggered = true;
		}, seconds * 1000);
	}

	/**
	 * Clear internal timeout.
	 */
	clearTrigger(): void {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}
		this.timeoutId = null;
	}

	/**
	 * Return seconds passed from the timer was started.
	 * Time spent paused does not count
	 * @returns Elapsed seconds
	 */
	getElapsed(): number {
		if (this.startedOn === null) {
			throw Error('elapsed time called before alarm started');
		}
		let val = now() - this.startedOn - this.spentPaused;

		if (this.pausedOn !== null) {
			val -= now() - this.pausedOn;
		}

		return val;
	}
}

/**
 * Return current time in seconds.
 * @returns Current time in seconds
 */
function now() {
	return Math.round(new Date().valueOf() / 1000);
}
