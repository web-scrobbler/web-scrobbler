import { Song } from '@/background/model/song/Song';
import { Processor } from '@/background/pipeline/Processor';
import { ExternalTrackInfoProvider } from '@/background/provider/ExternalTrackInfoProvider';

export class ExternalTrackInfoLoader implements Processor<Song> {
	constructor(private provider: ExternalTrackInfoProvider) {}

	async process(song: Song): Promise<void> {
		if (song.isEmpty()) {
			return;
		}

		const externalTrackInfo = await this.provider.getExternalTrackInfo(
			{
				artist: song.getArtist(),
				track: song.getTrack(),
				album: song.getAlbum(),
			} // TODO replace
		);
		const isExternalInfoExist = externalTrackInfo !== null;

		// TODO Move this option
		// const forceRecognize = getOption<boolean>(FORCE_RECOGNIZE);

		if (isExternalInfoExist) {
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
		}

		song.setFlag('isValid', isExternalInfoExist);
	}
}
