import { browser } from 'webextension-polyfill-ts';

import { getCurrentTab } from '@/common/util-browser';

import { Message } from '@/communication/message/Message';
import { MessageSender } from '@/communication/MessageSender';

export class CurrentTabMessageSender<Type> implements MessageSender<Type> {
	async sendMessage<Data, Response>(
		message: Message<Type, Data>
	): Promise<Response> {
		const tabId = await getCurrentTab();
		return (await browser.runtime.sendMessage({
			tabId,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			message,
		})) as Response;
	}
}
