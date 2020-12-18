/* eslint-disable indent */

import { Controller } from '@/background/object/controller';
import {
	ClonedSong,
	EditedSongInfo,
	LoveStatus,
} from '@/background/object/song';

import { Message } from '@/communication/message/Message';

import { MessageProccessor as MessageProcessor } from '@/communication/MessageProccessor';
import { ControllerMessageType } from '@/communication/controller/ControllerMessageType';

export class ControllerMessageProcessorImpl implements MessageProcessor {
	private controller: Controller;

	constructor(controller: Controller) {
		this.controller = controller;
	}

	processMessage(message: Message<unknown>): unknown {
		switch (message.type) {
			case ControllerMessageType.CorrectTrack:
				return this.processCorrectTrackMessage(
					message.data as EditedSongInfo
				);

			case ControllerMessageType.GetConnectorLabel:
				return this.proccessCorrectLabelMessage();

			case ControllerMessageType.GetTrack:
				return this.processGetTrackMessage();

			case ControllerMessageType.ResetTrack:
				return this.processResetTrackMessage();

			case ControllerMessageType.SkipTrack:
				return this.processSkipTrackMessage();

			case ControllerMessageType.ToggleLove:
				return this.processToggleLoveMessage(
					message.data as LoveStatus
				);
		}
	}

	private processCorrectTrackMessage(editedInfo: EditedSongInfo): void {
		this.controller.setUserSongData(editedInfo);
	}

	private proccessCorrectLabelMessage(): string {
		return this.controller.getConnector().label;
	}

	private processGetTrackMessage(): ClonedSong {
		return this.controller.getCurrentSong().getCloneableData();
	}

	private processResetTrackMessage(): void {
		this.controller.resetSongData();
	}

	private processSkipTrackMessage(): void {
		this.controller.skipCurrentSong();
	}

	private async processToggleLoveMessage(
		loveStatus: LoveStatus
	): Promise<LoveStatus> {
		await this.controller.toggleLove(loveStatus);
		return loveStatus;
	}
}
