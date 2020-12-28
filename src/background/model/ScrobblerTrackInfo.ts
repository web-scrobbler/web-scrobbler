import { SongMetadata } from '@/background/model/song/SongMetadata';
import { SongInfo } from '@/background/object/song';

export interface ExternalTrackInfo {
	trackInfo: SongInfo;
	metadata: SongMetadata;
}
