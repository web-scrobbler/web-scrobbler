import { LoveStatus } from '@/background/model/song/LoveStatus';

import type { Song } from '@/background/model/song/Song';
import type { SongPipelineStage } from '@/background/pipeline/SongPipelineStage';
import type { TrackContextInfoProvider } from '@/background/provider/TrackContextInfoProvider';

export class TrackContextInfoLoader implements SongPipelineStage {
	constructor(private provider: TrackContextInfoProvider) {}

	async process(song: Song): Promise<void> {
		const trackContextInfoArr = (
			await this.provider.getTrackContextInfo(song)
		).filter(Boolean);

		if (trackContextInfoArr.length === 0) {
			return;
		}

		for (const { loveStatus } of trackContextInfoArr) {
			if (loveStatus === undefined) {
				continue;
			}

			song.setLoveStatus(loveStatus);
			if (loveStatus === LoveStatus.Unloved) {
				break;
			}
		}

		const firstInfo = trackContextInfoArr[0];
		song.setMetadata('userPlayCount', firstInfo.userPlayCount);
	}
}
