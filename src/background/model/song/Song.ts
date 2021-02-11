import type { IdGenerator } from '@/background/util/id-generator/IdGenerator';
import type { LoveStatus } from '@/background/object/song';
import type { SongDto } from '@/background/model/song/SongDto';
import type { SongFlags } from '@/background/model/song/SongFlags';
import type { SongMetadata } from '@/background/model/song/SongMetadata';
import type { ScrobbleEntity } from '@/background/scrobbler/ScrobbleEntity';

export interface Song extends ScrobbleEntity {
	getArtist(): string;
	setArtist(artist: string): void;

	getTrack(): string;
	setTrack(track: string): void;

	getAlbum(): string;
	setAlbum(album: string): void;

	getAlbumArtist(): string;
	setAlbumArtist(albumArtist: string): void;

	getCurrentTime(): number;
	setCurrentTime(currentTime: number): void;

	getDuration(): number;
	setDuration(duration: number): void;

	getTrackArt(): string;
	setTrackArt(trackArt: string): void;

	getUniqueId(): string;
	generateUniqueIds(): IdGenerator;

	getLoveStatus(): LoveStatus;
	setLoveStatus(loveStatus: LoveStatus): void;

	getArtistTrackString(): string;

	isEmpty(): boolean;
	isValid(): boolean;

	isPlaying(): boolean;
	setPlaying(isPlaying: boolean): void;

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
