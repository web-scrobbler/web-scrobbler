export interface Notifier {
	notify(): Promise<void>;
}
