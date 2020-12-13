import { browser } from 'webextension-polyfill-ts';

import { Message } from '../message/Message';
import { TabMessageSender } from '../TabMessageSender';

export class ContentScriptMessageSender implements TabMessageSender {
	async sendMessage<M, R>(
		receiverTabId: number,
		message: Message<M>
	): Promise<R> {
		return (await browser.tabs.sendMessage(receiverTabId, message)) as R;
	}
}
