import { LoveStatus } from '@/background/model/song/LoveStatus';
import { TrackContextInfo } from '@/background/model/song/TrackContextInfo';
import { TrackInfo } from '@/background/model/song/TrackInfo';
import { TrackContextInfoProvider } from '@/background/provider/TrackContextInfoProvider';
import { ApiCallResult } from '@/background/scrobbler/api-call-result';
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
	 * @param trackInfo Object containing song info
	 *
	 * @return List of API call results
	 */
	sendNowPlayingRequest(trackInfo: TrackInfo): Promise<ApiCallResult[]>;

	/**
	 * Scrobble song to each granted scrobbler.
	 *
	 * @param trackInfo Object containing song info
	 *
	 * @return List of API call results
	 */
	sendScrobbleRequest(trackInfo: TrackInfo): Promise<ApiCallResult[]>;

	sendLoveRequest(
		trackInfo: TrackInfo,
		loveStatus: LoveStatus
	): Promise<ApiCallResult[]>;
}
