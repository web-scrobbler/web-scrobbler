import type { AnyFunction } from '#/helpers/util';
import type { Event } from '@/background/model/event/Event';

export class EventImpl<F extends AnyFunction> implements Event<F> {
	private eventListeners: Set<F> = new Set();

	addListener(cb: F): void {
		this.eventListeners.add(cb);
	}

	removeListener(cb: F): void {
		this.eventListeners.delete(cb);
	}

	call(args: Parameters<F>): void {
		for (const cb of this.eventListeners) {
			cb(...(args as unknown[]));
		}
	}
}
