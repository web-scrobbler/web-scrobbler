import { ExternalTrackInfo } from '@/background/model/ExternalTrackInfo';
import { SongInfo } from '@/background/object/song';

export interface SongInfoProvider {
	getSongInfo(songInfo: SongInfo): Promise<ExternalTrackInfo>;
}
