export interface TrackInfo {
	artist: string;
	track: string;
	album?: string;
	albumArtist?: string;

	duration?: number;
	originUrl?: string;
	timestamp?: number;
}
