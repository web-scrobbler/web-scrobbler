import { SongInfo } from '@/background/object/song';

export interface ScrobbleCache {
	addSong(songInfo: SongInfo, scrobblerIds: string[]): Promise<void>;
}
