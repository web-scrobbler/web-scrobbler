/**
 * Remind user authentication is required.
 */
export type AuthRemindFunction = () => Promise<void>;

/**
 * Show a notification.
 */
export type NotifyFunction = () => Promise<void>;
