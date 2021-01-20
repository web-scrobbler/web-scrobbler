import { Song } from '@/background/model/song/Song';

export interface CoverArtProvider {
	getCoverArt(song: Song): Promise<string>;
}
