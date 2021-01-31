import type { LoveStatus } from '@/background/model/song/LoveStatus';
import { TrackContextInfo } from '@/background/model/song/TrackContextInfo';
import type { TrackInfo } from '@/background/model/song/TrackInfo';

export interface ScrobbleService {
	/**
	 * Get user-specific context info for a track with the given track info.
	 *
	 * @param trackInfo Object containing track info
	 *
	 * @return Track context info
	 */
	getTrackContextInfo(trackInfo: TrackInfo): Promise<TrackContextInfo>;

	/**
	 * Send a now playing request.
	 *
	 * @param trackInfo Object containing track info
	 */
	sendNowPlayingRequest(trackInfo: TrackInfo): Promise<void>;

	/**
	 * Send a scrobble request.
	 *
	 * @param trackInfo Object containing track info
	 */
	sendScrobbleRequest(trackInfo: TrackInfo): Promise<void>;

	/**
	 * Send an (un)love request.
	 *
	 * @param trackInfo Object containing song info
	 * @param loveStatus Flag means song should be loved or not
	 */
	sendLoveRequest(
		trackInfo: TrackInfo,
		loveStatus: LoveStatus
	): Promise<void>;
}
