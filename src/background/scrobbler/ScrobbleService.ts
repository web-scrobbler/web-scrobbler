import type { LoveStatus } from '@/background/model/song/LoveStatus';
import type { TrackContextInfo } from '@/background/scrobbler/TrackContextInfo';
import type { ScrobbleEntity } from '@/background/scrobbler/ScrobbleEntity';

export interface ScrobbleService {
	/**
	 * Get user-specific context info for a track with the given track info.
	 *
	 * @param scrobbleEntity Object containing track info
	 *
	 * @return Track context info
	 */
	getTrackContextInfo(
		scrobbleEntity: ScrobbleEntity
	): Promise<TrackContextInfo>;

	/**
	 * Send a now playing request.
	 *
	 * @param scrobbleEntity Object containing track info
	 */
	sendNowPlayingRequest(scrobbleEntity: ScrobbleEntity): Promise<void>;

	/**
	 * Send a scrobble request.
	 *
	 * @param scrobbleEntity Object containing track info
	 */
	sendScrobbleRequest(scrobbleEntity: ScrobbleEntity): Promise<void>;

	/**
	 * Send an (un)love request.
	 *
	 * @param scrobbleEntity Object containing song info
	 * @param loveStatus Flag means song should be loved or not
	 */
	sendLoveRequest(
		scrobbleEntity: ScrobbleEntity,
		loveStatus: LoveStatus
	): Promise<void>;
}
