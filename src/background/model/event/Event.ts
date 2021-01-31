import type { AnyFunction } from '#/helpers/util';

export interface Event<F extends AnyFunction> {
	/**
	 * Add a new listener which will be called when the event is triggered.
	 *
	 * @param cb Callback function
	 */
	addListener(cb: F): void;

	/**
	 * Remove the given listener.
	 *
	 * @param cb Callback function
	 */
	removeListener(cb: F): void;
}
