import { Song } from '@/background/model/song/Song';
import { Processor } from '@/background/pipeline/Processor';

export class FieldNormalizer implements Processor<Song> {
	// eslint-disable-next-line @typescript-eslint/require-await
	async process(song: Song): Promise<void> {
		if (song.isEmpty()) {
			return;
		}

		song.setArtist(song.getArtist().normalize());
		song.setTrack(song.getTrack().normalize());

		if (song.getAlbum()) {
			song.setAlbum(song.getAlbum().normalize());
		}

		if (song.getAlbumArtist()) {
			song.setAlbumArtist(song.getAlbumArtist().normalize());
		}
	}
}
