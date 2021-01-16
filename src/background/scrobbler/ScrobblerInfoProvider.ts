import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

export interface ScrobblerInfoProvider {
	/**
	 * Get the scrobbler ID. The ID must be unique.
	 */
	getId(): ScrobblerId;

	/**
	 * Get the scrobbler label.
	 */
	getLabel(): string;

	/**
	 * Get URL to profile page.
	 *
	 * @return Profile URL
	 */
	getProfileUrl(): string;

	/**
	 * Get status page URL.
	 */
	getStatusUrl(): string;
}
