export interface Processor<T> {
	process(obj: T): Promise<void>;
}
