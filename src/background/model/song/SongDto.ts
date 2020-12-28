import { ConnectorState } from '@/background/model/ConnectorState';
import { LoveStatus } from '@/background/model/song/LoveStatus';
import { SongFlags } from '@/background/model/song/SongFlags';
import { SongMetadata } from '@/background/model/song/SongMetadata';

export interface SongDto {
	artist: string;
	track: string;
	album: string;
	albumArtist: string;

	trackArt: string;

	currentTime: number;
	duration: number;

	flags: SongFlags;
	metadata: SongMetadata;
	loveStatus: LoveStatus;

	connectorState: ConnectorState;
}
