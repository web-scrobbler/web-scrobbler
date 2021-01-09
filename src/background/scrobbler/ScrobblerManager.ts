import { SongInfo } from '../object/song';
import { ApiCallResult } from './api-call-result';
import { Scrobbler } from './Scrobbler';

export interface ScrobblerManager extends Iterable<Scrobbler> {
	/**
	 * Return a scrobbler by the given scrobbler ID.
	 *
	 * @return Scrobbler object
	 */
	getScrobblerById(scrobblerId: string): Scrobbler;

	addScrobbler(scrobbler: Scrobbler): void;

	removeScrobbler(scrobblerId: string): void;

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
