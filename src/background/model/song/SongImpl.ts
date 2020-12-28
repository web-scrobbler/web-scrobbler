import { Song } from '@/background/model/song/Song';
import { ConnectorState } from '@/background/model/ConnectorState';
import { LoveStatus } from '@/background/model/song/LoveStatus';
import {
	createDefaultSongFlags,
	SongFlags,
} from '@/background/model/song/SongFlags';
import {
	createDefaultSongMetadata,
	SongMetadata,
} from '@/background/model/song/SongMetadata';
import { SongDto } from '@/background/model/song/SongDto';

import { getObjectKeys } from '#/helpers/util';

export class SongImpl implements Song {
	private artist: string;
	private album: string;
	private track: string;
	private albumArtist: string;

	private trackArt: string;
	private uniqueId: string;

	private currentTime: number;
	private duration: number;

	private flags: SongFlags;
	private metadata: SongMetadata;

	private loveStatus: LoveStatus = LoveStatus.Unknown;

	constructor(private connectorState: ConnectorState) {
		this.artist = connectorState.artist;
		this.track = connectorState.track;
		this.album = connectorState.album;
		this.albumArtist = connectorState.albumArtist;

		this.trackArt = connectorState.trackArt;
		this.uniqueId = connectorState.uniqueID;

		this.currentTime = connectorState.currentTime || 0;
		this.duration = connectorState.duration || 0;

		this.resetFlags();
		this.resetMetadata();
	}

	getUniqueId(): string {
		return this.uniqueId;
	}

	resetFlags(): void {
		this.flags = createDefaultSongFlags();
	}

	resetMetadata(): void {
		this.metadata = createDefaultSongMetadata();
	}

	getArtist(): string {
		return this.artist;
	}

	setArtist(artist: string): void {
		this.artist = artist;
	}

	getTrack(): string {
		return this.track;
	}

	setTrack(track: string): void {
		this.track = track;
	}

	getAlbum(): string {
		return this.album;
	}

	setAlbum(album: string): void {
		this.album = album;
	}

	getAlbumArtist(): string {
		return this.albumArtist;
	}

	setAlbumArtist(albumArtist: string): void {
		this.albumArtist = albumArtist;
	}

	getCurrentTime(): number {
		return this.currentTime;
	}

	getDuration(): number {
		return this.duration;
	}

	setCurrentTime(currentTime: number): void {
		this.currentTime = currentTime;
	}

	setDuration(duration: number): void {
		this.duration = duration;
	}

	getTrackArt(): string {
		return this.trackArt;
	}

	setTrackArt(trackArt: string): void {
		this.trackArt = trackArt;
	}

	getLoveStatus(): LoveStatus {
		return this.loveStatus;
	}

	setLoveStatus(loveStatus: LoveStatus): void {
		this.loveStatus = loveStatus;
	}

	isEmpty(): boolean {
		return !(this.getArtist() && this.getTrack());
	}

	getFlag<K extends keyof SongFlags>(key: K): SongFlags[K] {
		return this.flags[key];
	}

	setFlag<K extends keyof SongFlags>(key: K, value: SongFlags[K]): void {
		this.flags[key] = value;
	}

	getMetadata<K extends keyof SongMetadata>(key: K): SongMetadata[K] {
		return this.metadata[key];
	}

	setMetadata<K extends keyof SongMetadata>(
		key: K,
		value: SongMetadata[K]
	): void {
		this.metadata[key] = value;
	}

	getRawProperty<K extends keyof ConnectorState>(key: K): ConnectorState[K] {
		return this.connectorState[key];
	}

	serialize(): SongDto {
		return {
			artist: this.getArtist(),
			track: this.getTrack(),
			album: this.getAlbum(),
			albumArtist: this.getAlbumArtist(),

			trackArt: this.getTrackArt(),

			currentTime: this.getCurrentTime(),
			duration: this.getDuration(),

			flags: this.flags,
			metadata: this.metadata,
			loveStatus: this.getLoveStatus(),

			connectorState: this.connectorState,
		};
	}

	static fromDto(songDto: SongDto): SongImpl {
		const song = new SongImpl(songDto.connectorState);

		song.setArtist(songDto.artist);
		song.setTrack(songDto.track);
		song.setAlbum(songDto.album);
		song.setAlbumArtist(songDto.albumArtist);

		song.setTrackArt(songDto.trackArt);

		song.setCurrentTime(songDto.currentTime);
		song.setDuration(songDto.duration);

		song.setLoveStatus(songDto.loveStatus);

		for (const flag of getObjectKeys(songDto.flags)) {
			const flagValue = songDto.flags[flag];
			song.setFlag(flag, flagValue);
		}

		for (const metadataKey of getObjectKeys(songDto.metadata)) {
			const metadataValue = songDto.metadata[metadataKey];
			song.setMetadata(metadataKey, metadataValue);
		}

		return song;
	}
}
