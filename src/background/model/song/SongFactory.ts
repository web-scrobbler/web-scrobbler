import { ConnectorState } from '@/background/model/ConnectorState';

import { Song } from '@/background/model/song/Song';
import { SongDto } from '@/background/model/song/SongDto';
import { SongImpl } from '@/background/model/song/SongImpl';

export function createSong(state: ConnectorState): Song {
	return new SongImpl(state);
}

export function createSongFromDto(songDto: SongDto): Song {
	return SongImpl.fromDto(songDto);
}
