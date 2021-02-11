import { LoveStatus } from '@/background/model/song/LoveStatus';

export interface TrackContextInfo {
	userPlayCount?: number;
	loveStatus?: LoveStatus;
}
