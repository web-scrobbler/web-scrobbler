/**
 * Object that can display a notification.
 */
export interface AuthNotifier {
	/**
	 * Show auth notification.
	 */
	notify(): Promise<void>;
}
