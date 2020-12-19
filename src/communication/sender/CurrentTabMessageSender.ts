import { browser } from 'webextension-polyfill-ts';

import { getCurrentTab } from '@/common/util-browser';

import { Message } from '@/communication/message/Message';
import { MessageSender } from '@/communication/MessageSender';

export class CurrentTabMessageSender implements MessageSender {
	async sendMessage<Data, Response>(
		message: Message<Data>
	): Promise<Response> {
		const tabId = await getCurrentTab();
		return (await browser.runtime.sendMessage({
			tabId,
			message,
		})) as Response;
	}
}
