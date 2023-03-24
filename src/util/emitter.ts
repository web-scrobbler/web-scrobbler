/**
 * Class that emulates event emitter behavior while having strict typing
 */
export default class EventEmitter<
	T extends Record<string, (...args: any[]) => void>
> {
	private events: Map<keyof T, T[keyof T][]> = new Map();
	/**
	 * Attach event listener
	 *
	 * @param event - event to listen to
	 * @param fn - callback function
	 */
	on<K extends keyof T>(event: K, fn: T[K]) {
		const curEvents = this.events.get(event) || [];
		this.events.set(event, [...curEvents, fn]);
	}

	/**
	 * Disconnect event listener
	 *
	 * @param event - event to disconnect from
	 * @param fn - callback function to disconnect
	 */
	off<K extends keyof T>(event: K, fn: T[K]) {
		const curEvents = this.events.get(event) || [];
		this.events.set(
			event,
			curEvents.filter((e) => e !== fn)
		);
	}

	/**
	 * Emit event
	 *
	 * @param event - event type to emit
	 * @param args - arguments to pass to callback functions
	 */
	emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>) {
		for (const e of this.events.get(event) || []) {
			e(...args);
		}
	}
}
