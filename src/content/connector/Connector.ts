import { ArtistTrack } from '@/content/connector/ArtistTrack';
import { TimeInfo } from '@/content/connector/TimeInfo';

export interface Connector {
	getArtist(): string;
	getAlbum(): string;
	getTrack(): string;
	getAlbumArtist(): string;

	getArtistTrack(): ArtistTrack;
	getTrackInfo(): string;
	getTimeInfo(): TimeInfo;

	getDuration(): number;
	getCurrentTime(): number;
	getRemainingTime(): number;

	getTrackArt(): string;
	isTrackArtDefault(): string;

	getUniqueId(): string;

	isPlaying(): boolean;

	getOriginUrl(): string;
}
