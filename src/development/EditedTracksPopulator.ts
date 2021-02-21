import type { EditedTrackInfo } from '@/background/repository/edited-tracks/EditedTrackInfo';
import type { EditedTracks } from '@/background/repository/edited-tracks/EditedTracks';
import type { EditedTracksRepositoryData } from '@/background/repository/edited-tracks/EditedTracksRepositoryData';

export async function populateEditedTracks(
	repository: EditedTracks
): Promise<void> {
	const editedTracks = generateEditedTracksData(10);

	for (const [songId, editedTrackInfo] of Object.entries(editedTracks)) {
		await repository.setSongInfo(songId, editedTrackInfo);
	}
}

function generateEditedTracksData(size: number): EditedTracksRepositoryData {
	const editedTracks = {};

	for (let i = 0; i < size; ++i) {
		editedTracks[`unique${i}`] = createEditedTrackInfo(i);
	}

	return editedTracks;
}

function createEditedTrackInfo(index: number): EditedTrackInfo {
	return {
		artist: `Artist ${index}`,
		track: `Track ${index}`,
		album: `Album ${index}`,
		albumArtist: `Album Artist ${index}`,
	};
}
