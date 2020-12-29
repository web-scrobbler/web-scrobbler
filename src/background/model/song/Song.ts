import { ConnectorState } from '@/background/model/ConnectorState';
import { SongFlags } from '@/background/model/song/SongFlags';
import { SongMetadata } from '@/background/model/song/SongMetadata';
import { LoveStatus } from '@/background/object/song';
import { SongDto } from '@/background/model/song/SongDto';

export interface Song {
	getArtist(): string;
	setArtist(artist: string): void;

	getTrack(): string;
	setTrack(track: string): void;

	getAlbum(): string;
	setAlbum(album: string): void;

	getAlbumArtist(): string;
	setAlbumArtist(albumArtist: string): void;

	getCurrentTime(): number;

	getDuration(): number;

	setCurrentTime(currentTime: number): void;
	setDuration(duration: number): void;

	getTrackArt(): string;
	setTrackArt(trackArt: string): void;

	getUniqueId(): string;

	getLoveStatus(): LoveStatus;
	setLoveStatus(loveStatus: LoveStatus): void;

	isEmpty(): boolean;

	getFlag<K extends keyof SongFlags>(key: K): SongFlags[K];
	setFlag<K extends keyof SongFlags>(key: K, value: SongFlags[K]): void;
	resetFlags(): void;

	getMetadata<K extends keyof SongMetadata>(key: K): SongMetadata[K];
	setMetadata<K extends keyof SongMetadata>(
		key: K,
		value: SongMetadata[K]
	): void;
	resetMetadata(): void;

	serialize(): SongDto;
}
