import { EditedTracksMessageType } from '@/communication/edited-tracks/EditedTracksMessageType';

import type { EditedTracksRepositoryData } from '@/background/repository/edited-tracks/EditedTracksRepositoryData';
import type { MessageSender } from '@/communication/MessageSender';

export class EditedTracksCommunicator {
	constructor(
		private messageSender: MessageSender<EditedTracksMessageType>
	) {}

	getEditedTracks(): Promise<EditedTracksRepositoryData> {
		return this.messageSender.sendMessage({
			type: EditedTracksMessageType.GetEditedTracks,
		});
	}

	importEditedTracks(
		editedTracks: EditedTracksRepositoryData
	): Promise<void> {
		return this.messageSender.sendMessage({
			type: EditedTracksMessageType.ImportEditedTracks,
			data: { editedTracks },
		});
	}

	removeEditedTrack(trackId: string): Promise<void> {
		return this.messageSender.sendMessage({
			type: EditedTracksMessageType.DeleteEditedTrack,
			data: { trackId },
		});
	}

	clearEditedTracks(): Promise<void> {
		return this.messageSender.sendMessage({
			type: EditedTracksMessageType.ClearEditedTracks,
		});
	}
}
