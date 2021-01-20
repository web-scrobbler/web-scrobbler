import { ConnectorState } from '@/background/model/ConnectorState';
import { LoveStatus } from '@/background/model/song/LoveStatus';
import { SongFlags } from '@/background/model/song/SongFlags';
import { SongMetadata } from '@/background/model/song/SongMetadata';

export interface SongDto {
	readonly artist: string;
	readonly track: string;
	readonly album: string;
	readonly albumArtist: string;

	readonly trackArt: string;

	readonly currentTime: number;
	readonly duration: number;

	readonly flags: SongFlags;
	readonly metadata: SongMetadata;
	readonly loveStatus: LoveStatus;

	readonly connectorState: ConnectorState;
}
