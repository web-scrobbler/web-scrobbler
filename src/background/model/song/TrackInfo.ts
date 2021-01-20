export interface TrackInfo {
	readonly artist: string;
	readonly track: string;
	readonly album?: string;
	readonly albumArtist?: string;

	readonly duration?: number;
	readonly originUrl?: string;
	readonly timestamp?: number;
}
