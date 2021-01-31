import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

export interface ScrobblerInfo {
	/**
	 * Scrobbler ID.
	 */
	readonly id: ScrobblerId;

	/**
	 * User profile URL.
	 */
	readonly profileUrl?: string;

	/**
	 * Base user profile URL.
	 */
	readonly baseProfileUrl?: string;
}
