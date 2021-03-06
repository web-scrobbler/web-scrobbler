import { ControllerMessageType } from '@/communication/controller/ControllerMessageType';

import { assertUnreachable, isInEnum } from '@/background/util/util';

import type { Message } from '@/communication/message/Message';
import type { CommunicationWorker } from '@/communication/CommunicationWorker';
import type { ActiveControllerProvider } from '@/background/object/ActiveControllerProvider';
import type { EditedTrackInfo } from '@/background/repository/edited-tracks/EditedTrackInfo';
import type { LoveStatus } from '@/background/model/song/LoveStatus';

export class ControllerWorker
	implements CommunicationWorker<ControllerMessageType> {
	constructor(private provider: ActiveControllerProvider) {}

	canProcessMessage(message: Message<unknown, unknown>): boolean {
		return isInEnum(message.type, ControllerMessageType);
	}

	async processMessage(
		message: Message<ControllerMessageType, unknown>
	): Promise<unknown> {
		const controller = this.provider.getActiveController();
		if (!controller) {
			return;
		}

		switch (message.type) {
			case ControllerMessageType.CorrectTrack: {
				return controller.setUserSongData(
					message.data as EditedTrackInfo
				);
			}

			case ControllerMessageType.GetConnectorLabel: {
				return controller.getConnector().label;
			}

			case ControllerMessageType.GetTrack: {
				return controller.getCurrentSong().serialize();
			}

			case ControllerMessageType.ResetTrack: {
				return controller.resetSongData();
			}

			case ControllerMessageType.SkipTrack: {
				return controller.skipCurrentSong();
			}

			case ControllerMessageType.ToggleLove: {
				return controller.toggleLove(message.data as LoveStatus);
			}

			default:
				assertUnreachable(message.type);
		}
	}
}
