import { Song } from '@/background/model/song/Song';
import { SongPipelineStage } from '@/background/pipeline/SongPipelineStage';

export class FieldNormalizer implements SongPipelineStage {
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
