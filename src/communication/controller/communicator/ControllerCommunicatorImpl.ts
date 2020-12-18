import { MessageSender } from '@/communication/MessageSender';

import { ControllerMessageType } from '@/communication/controller/ControllerMessageType';
import { ControllerCommunicator } from '@/communication/controller/communicator/ControllerCommunicator';

import {
	ClonedSong,
	EditedSongInfo,
	LoveStatus,
} from '@/background/object/song';

export class ControllerCommunicatorImpl implements ControllerCommunicator {
	private messageSender: MessageSender;

	constructor(sender: MessageSender) {
		this.messageSender = sender;
	}

	async correctTrack(editedInfo: EditedSongInfo): Promise<void> {
		const message = {
			type: ControllerMessageType.CorrectTrack,
			data: editedInfo,
		};
		return this.messageSender.sendMessage(message);
	}

	async getConnectorLabel(): Promise<string> {
		const message = { type: ControllerMessageType.GetConnectorLabel };
		return this.messageSender.sendMessage(message);
	}

	async getTrack(): Promise<ClonedSong> {
		const message = { type: ControllerMessageType.GetTrack };
		return this.messageSender.sendMessage(message);
	}

	async resetTrack(): Promise<void> {
		const message = { type: ControllerMessageType.ResetTrack };
		return this.messageSender.sendMessage(message);
	}

	async skipTrack(): Promise<void> {
		const message = { type: ControllerMessageType.SkipTrack };
		return this.messageSender.sendMessage(message);
	}

	async toggleLove(loveStatus: LoveStatus): Promise<LoveStatus> {
		const message = {
			type: ControllerMessageType.ToggleLove,
			data: loveStatus,
		};
		return this.messageSender.sendMessage(message);
	}
}
