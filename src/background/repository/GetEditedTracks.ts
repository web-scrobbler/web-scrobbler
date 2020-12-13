import { EditedTracks } from '@/background/repository/edited-tracks/EditedTracks';
import { EditedTracksImpl } from '@/background/repository/edited-tracks/EditedTracksImpl';
import { EditedTracksRepositoryData } from '@/background/repository/edited-tracks/EditedTracksRepositoryData';

import { createEditedTracksStorage } from '@/background/storage2/CreateStorage';

export function getEditedTracks(): EditedTracks {
	return editedTracks;
}

function createEditedTracks(): EditedTracks {
	const editedTracksStorage = createEditedTracksStorage<
		EditedTracksRepositoryData
	>();
	return new EditedTracksImpl(editedTracksStorage);
}

const editedTracks = createEditedTracks();
