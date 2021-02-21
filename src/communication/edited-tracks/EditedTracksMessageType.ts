import type { EditedTracksRepositoryData } from '@/background/repository/edited-tracks/EditedTracksRepositoryData';

export enum EditedTracksMessageType {
	ClearEditedTracks = 'ClearEditedTracks',
	DeleteEditedTrack = 'RemoveEditedTrack',
	ImportEditedTracks = 'ImportEditedTracks',
	GetEditedTracks = 'GetEditedTracks',
}

export interface RemoveEditedTrackPayload {
	trackId: string;
}

export interface ImportEditedTracksPayload {
	editedTracks: EditedTracksRepositoryData;
}
