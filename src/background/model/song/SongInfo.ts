import { ConnectorState } from '@/background/model/ConnectorState';

export interface SongInfoA {
	artist: string;
	track: string;
	album: string;
	albumArtist: string;
	trackArt: string;
}

export function createSongInfo(state: ConnectorState): SongInfoA {
	const { artist, track, album, albumArtist, trackArt } = state;

	return { artist, track, album, albumArtist, trackArt };
}
