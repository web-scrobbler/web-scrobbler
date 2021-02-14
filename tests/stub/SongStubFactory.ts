import {
	ConnectorState,
	createDefaultConnectorState,
} from '@/background/model/ConnectorState';
import { Song } from '@/background/model/song/Song';

export function createSongStub(state?: Partial<ConnectorState>): Song {
	const defaultState = createDefaultConnectorState();

	return new Song({
		...defaultState,
		artist: defaultArtist,
		track: defaultTrack,
		...state,
	});
}

export const defaultArtist = 'Artist';

export const defaultTrack = 'Track';
