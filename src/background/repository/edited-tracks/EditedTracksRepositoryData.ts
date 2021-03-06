import { EditedTrackInfo } from '@/background/repository/edited-tracks/EditedTrackInfo';

export interface EditedTracksRepositoryData {
	[repositoryKey: string]: EditedTrackInfo;
}
