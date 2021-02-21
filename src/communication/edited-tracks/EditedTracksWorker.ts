import {
	EditedTracksMessageType,
	ImportEditedTracksPayload,
	RemoveEditedTrackPayload,
} from '@/communication/edited-tracks/EditedTracksMessageType';
import { assertUnreachable, isInEnum } from '@/background/util/util';

import type { CommunicationWorker } from '@/communication/CommunicationWorker';
import type { EditedTracks } from '@/background/repository/edited-tracks/EditedTracks';
import type { Message } from '@/communication/message/Message';

export class EditedTracksWorker
	implements CommunicationWorker<EditedTracksMessageType> {
	constructor(private editedTracks: EditedTracks) {}

	processMessage(
		message: Message<EditedTracksMessageType, unknown>
	): Promise<unknown> {
		switch (message.type) {
			case EditedTracksMessageType.ClearEditedTracks: {
				return this.editedTracks.clear();
			}

			case EditedTracksMessageType.DeleteEditedTrack: {
				const { trackId } = message.data as RemoveEditedTrackPayload;
				return this.editedTracks.deleteSongInfo(trackId);
			}

			case EditedTracksMessageType.ImportEditedTracks: {
				const {
					editedTracks,
				} = message.data as ImportEditedTracksPayload;
				return this.editedTracks.importEditedTracks(editedTracks);
			}

			case EditedTracksMessageType.GetEditedTracks: {
				return this.editedTracks.getEditedTracks();
			}

			default:
				assertUnreachable(message.type);
		}
	}

	canProcessMessage(message: Message<unknown, unknown>): boolean {
		return isInEnum(message.type, EditedTracksMessageType);
	}
}
