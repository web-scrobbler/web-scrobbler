import { browser } from 'webextension-polyfill-ts';

import { MessageSender } from '../MessageSender';
import { Message } from '../message/Message';

export class AllMessageSender implements MessageSender {
	async sendMessage<Data, Response>(
		message: Message<Data>
	): Promise<Response> {
		return (await browser.runtime.sendMessage(message)) as Response;
	}
}
