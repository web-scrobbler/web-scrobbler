/* eslint-disable indent */
/* eslint-disable @typescript-eslint/require-await */

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

	processMessage(message: Message<unknown>): Promise<unknown> {
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

	private async processCorrectTrackMessage(
		editedInfo: EditedSongInfo
	): Promise<void> {
		return this.controller.setUserSongData(editedInfo);
	}

	private proccessCorrectLabelMessage(): Promise<string> {
		return Promise.resolve(this.controller.getConnector().label);
	}

	private async processGetTrackMessage(): Promise<ClonedSong> {
		return Promise.resolve(
			this.controller.getCurrentSong().getCloneableData()
		);
	}

	private async processResetTrackMessage(): Promise<void> {
		this.controller.resetSongData();
	}

	private async processSkipTrackMessage(): Promise<void> {
		this.controller.skipCurrentSong();
	}

	private async processToggleLoveMessage(
		loveStatus: LoveStatus
	): Promise<LoveStatus> {
		await this.controller.toggleLove(loveStatus);
		return loveStatus;
	}
}
