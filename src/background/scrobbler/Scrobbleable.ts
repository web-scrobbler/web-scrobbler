export interface Scrobbleable {
	getArtist(): string;
	getTrack(): string;
	getAlbum(): string;
	getAlbumArtist(): string;
	getDuration(): number;
	getOriginUrl(): string;
	getTimestamp(): number;
}
