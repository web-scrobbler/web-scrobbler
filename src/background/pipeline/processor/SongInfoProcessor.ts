import { Song } from '@/background/model/song/Song';
import { Processor } from '@/background/pipeline/Processor';
import { SongInfoProvider } from '@/background/provider/SongInfoProvider';

import { getObjectKeys } from '#/helpers/util';

export class SongInfoProcessor implements Processor<Song> {
	constructor(private songInfoFetcher: SongInfoProvider) {}

	async process(song: Song): Promise<void> {
		if (song.isEmpty()) {
			return;
		}

		const scrobblerSongInfo = await this.songInfoFetcher.getSongInfo(
			null
			// song.getInfo()
		);
		const isSongValid = scrobblerSongInfo !== null;

		// TODO Move this option
		// const forceRecognize = getOption<boolean>(FORCE_RECOGNIZE);

		if (isSongValid) {
			const { trackInfo, metadata } = scrobblerSongInfo;
			const { artist, track, album, duration } = trackInfo;

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

			for (const metadataProperty of getObjectKeys(metadata)) {
				song.setMetadata(metadataProperty, metadata[metadataProperty]);
			}

			// TODO move

			// for (const { metadata } of songInfoArr) {
			// 	song.setLoveStatus(metadata.userloved);
			// }
		}

		song.setFlag('isValid', isSongValid);
	}
}
