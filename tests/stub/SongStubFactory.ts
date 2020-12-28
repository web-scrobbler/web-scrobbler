import {
	ConnectorState,
	createDefaultConnectorState,
} from '@/background/model/ConnectorState';
import { Song } from '@/background/model/song/Song';
import { createSong } from '@/background/model/song/SongFactory';

export function createSongStub(state?: Partial<ConnectorState>): Song {
	const defaultState = createDefaultConnectorState();

	return createSong({
		...defaultState,
		artist: defaultArtist,
		track: defaultTrack,
		...state,
	});
}

export const defaultArtist = 'Artist';

export const defaultTrack = 'Track';
