import type { Song } from '@/background/model/song/Song';
import type { ExternalTrackInfo } from '@/background/provider/ExternalTrackInfo';

export interface ExternalTrackInfoProvider {
	/**
	 * Get track info from external service.
	 *
	 * @param song Track info
	 *
	 * @return External track info
	 */
	getExternalTrackInfo(song: Song): Promise<ExternalTrackInfo>;
}
