import { SongInfo } from '@/background/object/song';
import { ScrobblerSongInfo } from '@/background/scrobbler/base-scrobbler';

export interface SongInfoFetcher {
	getSongInfo(baseSongInfo: SongInfo): Promise<ScrobblerSongInfo>;
}
