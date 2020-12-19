import { browser } from 'webextension-polyfill-ts';

import { Message } from '@/communication/message/Message';
import { MessageSender } from '@/communication/MessageSender';

export class GlobalMessageSender<Type> implements MessageSender<Type> {
	async sendMessage<Data, Response>(
		message: Message<Type, Data>
	): Promise<Response> {
		return (await browser.runtime.sendMessage(message)) as Response;
	}
}
