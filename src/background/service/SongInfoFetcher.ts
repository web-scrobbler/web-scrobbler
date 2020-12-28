import { ExternalTrackInfo } from '@/background/model/ScrobblerTrackInfo';
import { SongInfo } from '@/background/object/song';

export interface SongInfoFetcher {
	getSongInfo(baseSongInfo: SongInfo): Promise<ExternalTrackInfo>;
}
