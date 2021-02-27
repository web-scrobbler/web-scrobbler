import { LoveStatus } from '@/background/model/song/LoveStatus';
import { TrackContextInfoProvider } from '@/background/provider/TrackContextInfoProvider';
import { ScrobblerResult } from '@/background/scrobbler/ScrobblerResult';
import { Scrobbleable } from '@/background/scrobbler/Scrobbleable';
import { Scrobbler } from '@/background/scrobbler/Scrobbler';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

export interface ScrobblerManager
	extends Iterable<Scrobbler>,
		TrackContextInfoProvider {
	/**
	 * Return a scrobbler by the given scrobbler ID.
	 *
	 * @return Scrobbler object
	 */
	getScrobblerById(scrobblerId: string): Scrobbler;

	/**
	 * Add or replace the given scrobbler.
	 *
	 * @param scrobbler Scrobbler object
	 */
	useScrobbler(scrobbler: Scrobbler): void;

	/**
	 * Remove a scrobbler with the given ID.
	 *
	 * @param  scrobblerId Scrobbler ID
	 */
	removeScrobbler(scrobblerId: ScrobblerId): void;

	/**
	 * Send now playing notification to each granted scrobbler.
	 *
	 * @param scrobbleEntity Object containing song info
	 *
	 * @return List of API call results
	 */
	sendNowPlayingRequest(
		scrobbleEntity: Scrobbleable
	): Promise<ScrobblerResult[]>;

	/**
	 * Scrobble song to each granted scrobbler.
	 *
	 * @param scrobbleEntity Object containing song info
	 *
	 * @return List of API call results
	 */
	sendScrobbleRequest(
		scrobbleEntity: Scrobbleable,
		scrobblerIds?: ReadonlyArray<ScrobblerId>
	): Promise<ScrobblerResult[]>;

	sendLoveRequest(
		scrobbleEntity: Scrobbleable,
		loveStatus: LoveStatus
	): Promise<ScrobblerResult[]>;
}
