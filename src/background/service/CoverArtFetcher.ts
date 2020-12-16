import { Song } from '@/background/object/song';

export interface CoverArtFetcher {
	getCoverArt(song: Song): Promise<string>;
}
