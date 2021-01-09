import { ScrobbleService } from '@/background/scrobbler/service/ScrobbleService';

export interface Scrobbler extends ScrobbleService {
	/**
	 * Get the scrobbler ID. The ID must be unique.
	 */
	getId(): string;

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
