import { Song } from '@/background/object/song';
import { Processor } from '@/background/pipeline/Processor';

export class FieldNormalizer implements Processor<Song> {
	// eslint-disable-next-line @typescript-eslint/require-await
	async process(song: Song): Promise<void> {
		for (const field of Song.BASE_FIELDS) {
			const fieldValue = song.getField(field);

			if (fieldValue !== null) {
				song.processed[field] = fieldValue.normalize();
			}
		}
	}
}
