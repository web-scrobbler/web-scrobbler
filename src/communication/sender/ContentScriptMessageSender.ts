import { browser } from 'webextension-polyfill-ts';

import { Message } from '@/communication/message/Message';
import { TabMessageSender } from '@/communication/TabMessageSender';

export class ContentScriptMessageSender<T> implements TabMessageSender<T> {
	async sendMessage<Data, Response>(
		receiverTabId: number,
		message: Message<T, Data>
	): Promise<Response> {
		return (await browser.tabs.sendMessage(
			receiverTabId,
			message
		)) as Response;
	}
}
