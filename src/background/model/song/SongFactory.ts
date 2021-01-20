import { SongImpl } from '@/background/model/song/SongImpl';

import type { ConnectorState } from '@/background/model/ConnectorState';
import type { Song } from '@/background/model/song/Song';
import type { SongDto } from '@/background/model/song/SongDto';

export function createSong(state: ConnectorState): Song {
	return new SongImpl(state);
}

export function createSongFromDto(songDto: SongDto): Song {
	return SongImpl.fromDto(songDto);
}
