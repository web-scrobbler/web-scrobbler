import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

export interface ScrobblerInfo {
	/**
	 * Scrobbler ID.
	 */
	readonly id: ScrobblerId;

	/**
	 * Scrobbler label.
	 */
	readonly label: string;

	/**
	 * User profile URL.
	 */
	readonly profileUrl?: string;

	/**
	 * Base user profile URL.
	 */
	readonly baseProfileUrl?: string;
}
