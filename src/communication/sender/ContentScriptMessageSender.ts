import { browser } from 'webextension-polyfill-ts';

import { Message } from '../message/Message';
import { TabMessageSender } from '../TabMessageSender';

export class ContentScriptMessageSender implements TabMessageSender<number> {
	async sendMessage<Data, Response>(
		receiverTabId: number,
		message: Message<Data>
	): Promise<Response> {
		return (await browser.tabs.sendMessage(
			receiverTabId,
			message
		)) as Response;
	}
}
