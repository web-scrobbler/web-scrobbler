import { EditedSongInfo } from '@/background/object/song';

export interface EditedTracksRepositoryData {
	[repositoryKey: string]: EditedSongInfo;
}
