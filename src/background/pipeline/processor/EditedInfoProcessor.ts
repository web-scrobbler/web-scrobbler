import { EditedSongInfo, Song } from '@/background/object/song';
import { Processor } from '@/background/pipeline/Processor';
import { EditedTracks } from '@/background/repository/edited-tracks/EditedTracks';

export class EditedInfoProcessor implements Processor<Song> {
	constructor(private editedTracks: EditedTracks) {}

	async process(song: Song): Promise<void> {
		let editedSongInfo: EditedSongInfo = null;
		try {
			editedSongInfo = await this.editedTracks.getSongInfo(song);
		} catch {
			return;
		}

		for (const field of Song.BASE_FIELDS) {
			song.processed[field] = editedSongInfo[field];
		}
	}
}
