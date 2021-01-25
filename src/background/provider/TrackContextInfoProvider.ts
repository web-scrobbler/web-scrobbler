import type { TrackContextInfo } from '@/background/model/song/TrackContextInfo';
import type { TrackInfo } from '@/background/model/song/TrackInfo';

export interface TrackContextInfoProvider {
	getTrackContextInfo(trackInfo: TrackInfo): Promise<TrackContextInfo[]>;
}
