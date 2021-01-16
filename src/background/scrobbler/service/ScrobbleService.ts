import type { LoveStatus } from '@/background/model/song/LoveStatus';
import type { TrackInfo } from '@/background/model/song/TrackInfo';

export interface ScrobbleService {
	/**
	 * Send a now playing request.
	 *
	 * @param trackInfo Object containing track info
	 *
	 * @return API call result
	 */
	sendNowPlayingRequest(trackInfo: TrackInfo): Promise<void>;

	/**
	 * Send a scrobble request.
	 *
	 * @param trackInfo Object containing track info
	 *
	 * @return API call result
	 */
	sendScrobbleRequest(trackInfo: TrackInfo): Promise<void>;

	/**
	 * Send an (un)love request.
	 *
	 * @param trackInfo Object containing song info
	 * @param loveStatus Flag means song should be loved or not
	 *
	 * @return API call result
	 */
	sendLoveRequest(
		trackInfo: TrackInfo,
		loveStatus: LoveStatus
	): Promise<void>;
}
