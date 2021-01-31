import { Song } from '@/background/model/song/Song';

export interface AlbumIdProvider {
	getAlbumId(song: Song): Promise<string>;
}
