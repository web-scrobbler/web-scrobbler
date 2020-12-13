/* eslint-disable indent */

import { Controller } from '@/background/object/controller';
import {
	ClonedSong,
	EditedSongInfo,
	LoveStatus,
} from '@/background/object/song';

import { Message } from '@/communication/message/Message';

import { MessageReceiver } from '@/communication/MessageReceiver';
import { ControllerMessageType } from '@/communication/controller/ControllerMessageType';

export class ControllerMessageReceiverImpl implements MessageReceiver {
	private controller: Controller;

	constructor(controller: Controller) {
		this.controller = controller;
	}

	onMessageReceived(message: Message<unknown>): unknown {
		switch (message.type) {
			case ControllerMessageType.CorrectTrack:
				return this.OnCorrectTrack(message.data as EditedSongInfo);

			case ControllerMessageType.GetConnectorLabel:
				return this.onGetConnectorLabel();

			case ControllerMessageType.GetTrack:
				return this.onGetTrack();

			case ControllerMessageType.ToggleLove:
				return this.onToggleLove(message.data as LoveStatus);
		}
	}

	private OnCorrectTrack(editedInfo: EditedSongInfo): void {
		this.controller.setUserSongData(editedInfo);
	}

	private onGetConnectorLabel(): string {
		return this.controller.getConnector().label;
	}

	private onGetTrack(): ClonedSong {
		return this.controller.getCurrentSong().getCloneableData();
	}

	private async onToggleLove(loveStatus: LoveStatus): Promise<LoveStatus> {
		await this.controller.toggleLove(loveStatus);
		return loveStatus;
	}
}
