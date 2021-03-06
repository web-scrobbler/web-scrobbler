import { MessageSender } from '@/communication/MessageSender';

import { ControllerMessageType } from '@/communication/controller/ControllerMessageType';
import { ControllerCommunicator } from '@/communication/controller/ControllerCommunicator';
import { EditedTrackInfo } from '@/background/repository/edited-tracks/EditedTrackInfo';
import { SongDto } from '@/background/model/song/SongDto';
import { LoveStatus } from '@/background/model/song/LoveStatus';

export class ControllerCommunicatorImpl implements ControllerCommunicator {
	constructor(private messageSender: MessageSender<ControllerMessageType>) {}

	async correctTrack(editedInfo: EditedTrackInfo): Promise<void> {
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

	async getTrack(): Promise<SongDto> {
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
