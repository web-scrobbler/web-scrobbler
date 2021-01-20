import { SongMetadata } from '@/background/model/song/SongMetadata';
import { TrackInfo } from '@/background/model/song/TrackInfo';

export interface ExternalTrackInfo {
	trackInfo: TrackInfo;
	metadata: SongMetadata;
}
