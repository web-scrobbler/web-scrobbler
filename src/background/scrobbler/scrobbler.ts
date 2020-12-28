import { Session } from '../account/session';
import { Account } from '../account/account';
import { UserProperties } from '../account/user-properties';
import { ScrobbleService } from '@/background/scrobbler/service/ScrobbleService';

export interface Scrobbler extends ScrobbleService {
	/**
	 * Return information about user account.
	 *
	 * @return User account info
	 */
	getAccount(): Account;

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
	 * Get session data.
	 *
	 * @return Session data
	 */
	getSession(): Session;

	/**
	 * Get status page URL.
	 */
	getStatusUrl(): string;

	/**
	 * Check if a user is signed in to the scrobbling service.
	 *
	 * @return Check result
	 */
	isSignedIn(): boolean;

	/**
	 * Request an auth URL where user should grant permission to the extension.
	 *
	 * @return Auth URL
	 */
	requestAuthUrl(): Promise<string>;

	/**
	 * Sign out.
	 */
	signOut(): Promise<void>;
}
