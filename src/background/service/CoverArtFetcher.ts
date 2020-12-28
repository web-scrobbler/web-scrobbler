import { Song } from '@/background/model/song/Song';

export interface CoverArtFetcher {
	getCoverArt(song: Song): Promise<string>;
}
