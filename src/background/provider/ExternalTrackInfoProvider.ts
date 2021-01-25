import type { TrackInfo } from '@/background/model/song/TrackInfo';
import type { ExternalTrackInfo } from '@/background/provider/ExternalTrackInfo';

export interface ExternalTrackInfoProvider {
	/**
	 * Get track info from external service.
	 *
	 * @param trackInfo Track info
	 *
	 * @return External track info
	 */
	getExternalTrackInfo(trackInfo: TrackInfo): Promise<ExternalTrackInfo>;
}
