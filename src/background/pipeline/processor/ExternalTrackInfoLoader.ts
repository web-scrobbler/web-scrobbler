import { Song } from '@/background/model/song/Song';
import { SongPipelineStage } from '@/background/pipeline/SongPipelineStage';
import { ExternalTrackInfo } from '@/background/provider/ExternalTrackInfo';
import { ExternalTrackInfoProvider } from '@/background/provider/ExternalTrackInfoProvider';

export class ExternalTrackInfoLoader implements SongPipelineStage {
	constructor(private provider: ExternalTrackInfoProvider) {}

	async process(song: Song): Promise<void> {
		if (song.isEmpty()) {
			return;
		}

		let externalTrackInfo: ExternalTrackInfo;
		try {
			externalTrackInfo = await this.provider.getExternalTrackInfo(song);
		} catch {
			return;
		}

		// TODO Move this option
		// const forceRecognize = getOption<boolean>(FORCE_RECOGNIZE);

		const { artist, track, album, duration } = externalTrackInfo;

		if (!song.getFlag('isCorrectedByUser')) {
			song.setArtist(artist);
			song.setTrack(track);

			if (!song.getAlbum()) {
				song.setAlbum(album);
			}

			if (!song.getDuration()) {
				song.setDuration(duration);
			}
		}

		if (!song.getTrackArt()) {
			song.setTrackArt(externalTrackInfo.trackArtUrl);
		}

		song.setMetadata('albumMbId', externalTrackInfo.albumMbId);
		song.setMetadata('albumUrl', externalTrackInfo.albumUrl);
		song.setMetadata('artistUrl', externalTrackInfo.artistUrl);
		song.setMetadata('trackUrl', externalTrackInfo.trackUrl);

		song.setFlag('isValid', true);
	}
}
