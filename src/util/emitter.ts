export default class EventEmitter<
	T extends Record<string, (...args: any[]) => void>
> {
	private events: Map<keyof T, T[keyof T][]> = new Map();
	on<K extends keyof T>(event: K, fn: T[K]) {
		const curEvents = this.events.get(event) || [];
		this.events.set(event, [...curEvents, fn]);
	}

	off<K extends keyof T>(event: K, fn: T[K]) {
		const curEvents = this.events.get(event) || [];
		this.events.set(
			event,
			curEvents.filter((e) => e !== fn)
		);
	}

	emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>) {
		for (const e of this.events.get(event) || []) {
			e(...args);
		}
	}
}
