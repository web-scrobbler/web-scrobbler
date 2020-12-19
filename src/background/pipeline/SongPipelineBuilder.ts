import { Song } from '@/background/object/song';
import { Processor } from '@/background/pipeline/Processor';
import { CoverArtProcessor } from '@/background/pipeline/processor/CoverArtProcessor';
import { EditedInfoProcessor } from '@/background/pipeline/processor/EditedInfoProcessor';
import { FieldNormalizer } from '@/background/pipeline/processor/FieldNormalizer';
import { SongPipeline } from '@/background/pipeline/SongPipeline';
import { getEditedTracks } from '@/background/repository/GetEditedTracks';
import { CoverArtArchiveFetcher } from '@/background/service/CoverArtArchiveFetcher';

export function CreateSongPipeline(): Processor<Song> {
	const fieldNormalizer = new FieldNormalizer();

	const coverArtFetcher = new CoverArtArchiveFetcher();
	const coverArtProcessor = new CoverArtProcessor(coverArtFetcher);

	const editedTracks = getEditedTracks();
	const editedInfoProcessor = new EditedInfoProcessor(editedTracks);

	const processors: Processor<Song>[] = [
		fieldNormalizer,
		editedInfoProcessor,
		coverArtProcessor,
	];
	return new SongPipeline(processors);
}
