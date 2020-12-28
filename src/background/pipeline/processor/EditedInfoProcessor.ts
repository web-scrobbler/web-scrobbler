import { Song } from '@/background/model/song/Song';
import { Processor } from '@/background/pipeline/Processor';
import { EditedTrackInfo } from '@/background/repository/edited-tracks/EditedTrackInfo';
import { EditedTracks } from '@/background/repository/edited-tracks/EditedTracks';

export class EditedInfoProcessor implements Processor<Song> {
	constructor(private editedTracks: EditedTracks) {}

	async process(song: Song): Promise<void> {
		let editedTrackInfo: EditedTrackInfo = null;
		try {
			editedTrackInfo = await this.editedTracks.getSongInfo(song);
		} catch {
			return;
		}

		song.setArtist(editedTrackInfo.artist);
		song.setTrack(editedTrackInfo.track);
		song.setAlbum(editedTrackInfo.album);
		song.setAlbumArtist(editedTrackInfo.albumArtist);
	}
}
