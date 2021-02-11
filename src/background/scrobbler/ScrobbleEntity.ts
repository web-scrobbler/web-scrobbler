export interface ScrobbleEntity {
	getArtist(): string;
	getTrack(): string;
	getAlbum(): string;
	getAlbumArtist(): string;
	getDuration(): number;
	getOriginUrl(): string;
	getTimestamp(): number;
}
