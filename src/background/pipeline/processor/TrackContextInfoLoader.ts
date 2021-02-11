import { LoveStatus } from '@/background/model/song/LoveStatus';

import type { Song } from '@/background/model/song/Song';
import type { Processor } from '@/background/pipeline/Processor';
import type { TrackContextInfoProvider } from '@/background/provider/TrackContextInfoProvider';

export class TrackContextInfoLoader implements Processor<Song> {
	constructor(private provider: TrackContextInfoProvider) {}

	async process(song: Song): Promise<void> {
		const trackContextInfoArr = (
			await this.provider.getTrackContextInfo(song)
		).filter((info) => info !== null);

		console.log(trackContextInfoArr);

		if (trackContextInfoArr.length === 0) {
			return;
		}

		for (const { loveStatus } of trackContextInfoArr) {
			if (loveStatus === undefined) {
				continue;
			}

			if (song.getLoveStatus() === LoveStatus.Unloved) {
				continue;
			}

			song.setLoveStatus(loveStatus);
		}

		const firstInfo = trackContextInfoArr[0];
		song.setMetadata('userPlayCount', firstInfo.userPlayCount);
	}
}
