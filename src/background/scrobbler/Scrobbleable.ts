export interface Scrobbleable {
	getArtist(): string;
	getTrack(): string;
	getAlbum(): string;
	getAlbumArtist(): string;
	getDuration(): number;
	getOriginUrl(): string;
	getTimestamp(): number;
}

export interface ScrobbleableDto {
	readonly artist: string;
	readonly track: string;
	readonly album: string;
	readonly albumArtist: string;
	readonly duration: number;
	readonly originUrl: string;
	readonly timestamp: number;
}

export function createScrobbleableDto(
	scrobbleable: Scrobbleable
): ScrobbleableDto {
	return {
		artist: scrobbleable.getArtist(),
		track: scrobbleable.getTrack(),
		album: scrobbleable.getAlbum(),
		albumArtist: scrobbleable.getAlbumArtist(),
		duration: scrobbleable.getDuration(),
		originUrl: scrobbleable.getOriginUrl(),
		timestamp: scrobbleable.getTimestamp(),
	};
}

export function createScrobbleableFromDto(dto: ScrobbleableDto): Scrobbleable {
	return {
		getArtist: () => dto.artist,
		getTrack: () => dto.track,
		getAlbum: () => dto.album,
		getAlbumArtist: () => dto.albumArtist,
		getDuration: () => dto.duration,
		getOriginUrl: () => dto.originUrl,
		getTimestamp: () => dto.timestamp,
	};
}
