export interface Logger {
	trace(...x: unknown[]): void;
	debug(...x: unknown[]): void;
	info(...x: unknown[]): void;
	log(...x: unknown[]): void;
	warn(...x: unknown[]): void;
	error(...x: unknown[]): void;
	time(label: string): void;
	timeEnd(label: string): void;
}
