import { Scrobbler } from '@/background/scrobbler/Scrobbler';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import { SongInfo } from '../object/song';
import { ApiCallResult } from './api-call-result';

export interface ScrobblerManager extends Iterable<Scrobbler> {
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
	 * @param songInfo Object containing song info
	 *
	 * @return List of API call results
	 */
	sendNowPlayingRequest(songInfo: SongInfo): Promise<ApiCallResult[]>;

	/**
	 * Scrobble song to each granted scrobbler.
	 *
	 * @param songInfo Object containing song info
	 *
	 * @return List of API call results
	 */
	sendScrobbleRequest(songInfo: SongInfo): Promise<ApiCallResult[]>;
}
