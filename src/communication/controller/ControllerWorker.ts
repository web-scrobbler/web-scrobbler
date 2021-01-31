import { EditedSongInfo, LoveStatus } from '@/background/object/song';

import { ControllerMessageType } from '@/communication/controller/ControllerMessageType';

import { assertUnreachable, isInEnum } from '@/background/util/util';

import type { Message } from '@/communication/message/Message';
import type { CommunicationWorker } from '@/communication/MessageReceiver';
import type { ActiveControllerProvider } from '@/background/ActiveControllerProvider';

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
					message.data as EditedSongInfo
				);
			}

			case ControllerMessageType.GetConnectorLabel: {
				return controller.getConnector().label;
			}

			case ControllerMessageType.GetTrack: {
				return controller.getCurrentSong().getCloneableData();
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
