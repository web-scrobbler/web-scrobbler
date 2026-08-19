'use strict';

const Options = import('@/core/storage/options');

/**
 * Log type for debug messages.
 */
export type DebugLogType = 'log' | 'error' | 'warn' | 'info';

/**
 * Handle async checks for DEBUG_LOGGING_ENABLED option while ensuring
 * that logs are still printed in a predictable order.
 */
class DebugLogQueue {
	private queue: { text: unknown; logType: DebugLogType }[] = [];
	private isActive = false;
	private shouldPrint = Options.then((awaitedOptions) =>
		awaitedOptions.getOption(awaitedOptions.DEBUG_LOGGING_ENABLED),
	);

	/**
	 * Enqueue a log message to be printed.
	 * @param text - Debug message
	 * @param logType - Log type
	 */
	public push(text: unknown, logType: DebugLogType): void {
		this.queue.push({ text, logType });
		this.start();
	}

	/**
	 * Process the queue to print logs in order.
	 */
	private async start(): Promise<void> {
		if (this.isActive) {
			return;
		}
		this.isActive = true;

		try {
			for (let i = 0; i < 100 && this.queue.length > 0; i++) {
				const currentMessage = this.queue.shift();
				if (currentMessage && (await this.shouldPrint)) {
					const logFunc = console[currentMessage.logType];

					if (typeof logFunc !== 'function') {
						throw new TypeError(
							`Unknown log type: ${currentMessage.logType}`,
						);
					}

					const message = `Web Scrobbler: ${currentMessage.text?.toString()}`;
					logFunc(message);
				}
			}
			this.isActive = false;
		} catch {
			this.isActive = false;
		}
	}
}
const debugLogQueue = new DebugLogQueue();

/**
 * Print debug message with prefixed "Web Scrobbler" string.
 * @param text - Debug message
 * @param logType - Log type
 */
/* istanbul ignore next */
export function debugLog(text: unknown, logType: DebugLogType = 'log'): void {
	debugLogQueue.push(text, logType);
}
