import type { Scrobbler } from '@/background/scrobbler/Scrobbler';
import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { ScrobblerSession } from '@/background/scrobbler/ScrobblerSession';
import type { UserProperties } from '@/background/scrobbler/UserProperties';

/**
 * Object that creates scrobblers.
 */
export interface ScrobblerFactory {
	/**
	 * Create a new scrobbler instance by a given scrobbler ID.
	 *
	 * @param scrobblerId Scrobbler ID to create
	 * @param session Scrobbler session
	 * @param [properties] User properties
	 *
	 * @return Scrobbler object
	 */
	createScrobbler(
		scrobblerId: ScrobblerId,
		session: ScrobblerSession,
		properties?: UserProperties
	): Scrobbler;
}
