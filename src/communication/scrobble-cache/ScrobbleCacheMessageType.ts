import { ScrobbleCacheData } from '@/background/repository/scrobble-cache/ScrobbleCacheData';
import { ScrobbleableDto } from '@/background/scrobbler/Scrobbleable';

export enum ScrobbleCacheMessageType {
	GetUnscrobbledTracks,
	GetTrack,
	ClearUnscrobbledTracks,
	DeleteUnscrobbledTrack,
	ImportEditedTracks,
	ScrobbleTrack,
	UpdateTrackInfo,
}

export interface TrackIdPayload {
	entryId: string;
}

export interface ImportUnscrobbledTracksPayload {
	scrobbleCache: ScrobbleCacheData;
}

export interface UpdateTrackInfoPayload {
	entryId: string;
	trackInfo: ScrobbleableDto;
}
