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
import { createTimeInfo, TimeInfo } from '@/background/model/song/TimeInfo';
import { createSongInfo, SongInfoA } from '@/background/model/song/SongInfo';
import { SongUniqueIdGenerator } from '@/background/model/song/SongUniqueIdGenerator';

export class SongImpl implements Song {
	private songInfo: SongInfoA;
	private timeInfo: TimeInfo;

	private uniqueId: string;
	private uniqueIdGenerator: SongUniqueIdGenerator;

	private flags: SongFlags;
	private metadata: SongMetadata;

	private loveStatus: LoveStatus = LoveStatus.Unknown;

	constructor(private connectorState: ConnectorState) {
		this.songInfo = createSongInfo(connectorState);
		this.timeInfo = createTimeInfo(connectorState);

		this.uniqueId = connectorState.uniqueID;
		this.uniqueIdGenerator = this.resetFlags();
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
		return this.songInfo.artist;
	}

	setArtist(artist: string): void {
		this.songInfo.artist = artist;
	}

	getTrack(): string {
		return this.songInfo.track;
	}

	setTrack(track: string): void {
		this.songInfo.track = track;
	}

	getAlbum(): string {
		return this.songInfo.album;
	}

	setAlbum(album: string): void {
		this.songInfo.album = album;
	}

	getAlbumArtist(): string {
		return this.songInfo.albumArtist;
	}

	setAlbumArtist(albumArtist: string): void {
		this.songInfo.albumArtist = albumArtist;
	}

	getCurrentTime(): number {
		return this.timeInfo.currentTime;
	}

	getDuration(): number {
		return this.timeInfo.duration;
	}

	setCurrentTime(currentTime: number): void {
		this.timeInfo.currentTime = currentTime;
	}

	setDuration(duration: number): void {
		this.timeInfo.duration = duration;
	}

	getTrackArt(): string {
		return this.songInfo.trackArt;
	}

	setTrackArt(trackArt: string): void {
		this.songInfo.trackArt = trackArt;
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
