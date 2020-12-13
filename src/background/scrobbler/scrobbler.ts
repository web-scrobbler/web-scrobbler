import { LoveStatus, SongInfo } from '../object/song';
import { ApiCallResult } from './api-call-result';
import { Session } from '../account/session';
import { Account } from '../account/account';
import { UserProperties } from '../account/user-properties';

export interface Scrobbler {
	/**
	 * Check if service supports loving songs.
	 *
	 * @return True if service supports that; false otherwise
	 */
	canLoveSong(): boolean;

	/**
	 * Check if service supports retrieving of song info.
	 *
	 * @return True if service supports that; false otherwise
	 */
	canLoadSongInfo(): boolean;

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
	 * Return user properties.
	 *
	 * @return User properties
	 */
	getUserProperties(): UserProperties;

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
	 * Send a now playing request.
	 *
	 * @param songInfo Object containing song info
	 *
	 * @return API call result
	 */
	sendNowPlayingRequest(songInfo: SongInfo): Promise<ApiCallResult>;

	/**
	 * Send a scrobble request.
	 *
	 * @param songInfo Object containing song info
	 *
	 * @return API call result
	 */
	sendScrobbleRequest(songInfo: SongInfo): Promise<ApiCallResult>;

	/**
	 * Send an (un)love request.
	 *
	 * @param songInfo Object containing song info
	 * @param loveStatus Flag means song should be loved or not
	 *
	 * @return API call result
	 */
	sendLoveRequest(
		songInfo: SongInfo,
		loveStatus: LoveStatus
	): Promise<ApiCallResult>;

	/**
	 * Sign out.
	 */
	signOut(): Promise<void>;
}
