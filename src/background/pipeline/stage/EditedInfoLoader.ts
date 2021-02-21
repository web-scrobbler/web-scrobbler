import type { EditedTrackInfo } from '@/background/repository/edited-tracks/EditedTrackInfo';
import type { EditedTracks } from '@/background/repository/edited-tracks/EditedTracks';
import type { Song } from '@/background/model/song/Song';
import type { SongPipelineStage } from '@/background/pipeline/SongPipelineStage';

export class EditedInfoLoader implements SongPipelineStage {
	constructor(private editedTracks: EditedTracks) {}

	async process(song: Song): Promise<void> {
		let editedTrackInfo: EditedTrackInfo = null;
		try {
			editedTrackInfo = await this.editedTracks.getSongInfo(
				song.generateUniqueIds()
			);
		} catch {
			return;
		}

		if (!editedTrackInfo) {
			return;
		}

		song.setArtist(editedTrackInfo.artist);
		song.setTrack(editedTrackInfo.track);
		song.setAlbum(editedTrackInfo.album);
		song.setAlbumArtist(editedTrackInfo.albumArtist);

		song.setFlag('isCorrectedByUser', true);
	}
}
