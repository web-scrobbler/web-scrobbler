import { Song } from '@/background/object/song';
import { Processor } from '@/background/pipeline/Processor';
import { SongInfoFetcher } from '@/background/service/SongInfoFetcher';

export class SongInfoProcessor implements Processor<Song> {
	constructor(private songInfoFetcher: SongInfoFetcher) {}

	async process(song: Song): Promise<void> {
		if (song.isEmpty()) {
			return;
		}

		const scrobblerSongInfo = await this.songInfoFetcher.getSongInfo(
			song.getInfo()
		);
		const isSongValid = scrobblerSongInfo !== null;

		// TODO Move this option
		// const forceRecognize = getOption<boolean>(FORCE_RECOGNIZE);

		if (isSongValid) {
			// TODO Rewrite using loops

			const { songInfo, metadata } = scrobblerSongInfo;

			if (!song.flags.isCorrectedByUser) {
				song.processed.duration = songInfo.duration;
				song.processed.artist = songInfo.artist;
				song.processed.track = songInfo.track;

				if (!song.getAlbum()) {
					song.processed.album = songInfo.album;
				}
			}

			song.metadata.trackArtUrl = metadata.trackArtUrl;
			song.metadata.artistUrl = metadata.artistUrl;
			song.metadata.trackUrl = metadata.trackUrl;
			song.metadata.albumUrl = metadata.albumUrl;
			song.metadata.userPlayCount = metadata.userPlayCount;
			song.metadata.albumMbId = metadata.albumMbId;

			// TODO move

			// for (const { metadata } of songInfoArr) {
			// 	song.setLoveStatus(metadata.userloved);
			// }
		}

		song.flags.isValid = isSongValid;
	}
}
