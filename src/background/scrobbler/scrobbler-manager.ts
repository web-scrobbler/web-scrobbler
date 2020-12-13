import { SongInfo } from '../object/song';
import { ApiCallResult } from './api-call-result';
import { Scrobbler } from './scrobbler';

export interface ScrobblerManager {
	getGrantedScrobblers(): Scrobbler[];

	getScrobblerById(): Scrobbler;

	registerScrobbler(scrobbler: Scrobbler): void;

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
