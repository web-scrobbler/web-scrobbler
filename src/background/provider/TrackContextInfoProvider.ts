import { Song } from '@/background/model/song/Song';
import type { TrackContextInfo } from '@/background/scrobbler/TrackContextInfo';

export interface TrackContextInfoProvider {
	getTrackContextInfo(song: Song): Promise<TrackContextInfo[]>;
}
