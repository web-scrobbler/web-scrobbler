import { EditedTracks } from '@/background/repository/edited-tracks/EditedTracks';
import { EditedTracksImpl } from '@/background/repository/edited-tracks/EditedTracksImpl';

import { createEditedTracksStorage } from '@/background/storage2/StorageFactory';

export function getEditedTracks(): EditedTracks {
	return editedTracks;
}

const editedTracks = new EditedTracksImpl(createEditedTracksStorage());
