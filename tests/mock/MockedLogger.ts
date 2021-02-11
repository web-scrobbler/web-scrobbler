import type { Logger } from '@/background/util/Logger';

export class DummyLogger implements Logger {
	trace(): void {
		// Do nothing
	}

	debug(): void {
		// Do nothing
	}

	info(): void {
		// Do nothing
	}

	log(): void {
		// Do nothing
	}

	warn(): void {
		// Do nothing
	}

	error(): void {
		// Do nothing
	}

	time(): void {
		// Do nothing
	}

	timeEnd(): void {
		// Do nothing
	}
}

export const loggerStub = new DummyLogger();
