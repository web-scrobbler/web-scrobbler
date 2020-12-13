import { browser } from 'webextension-polyfill-ts';

import { MessageSender } from '../MessageSender';
import { Message } from '../message/Message';

export class AllMessageSender implements MessageSender {
	async sendMessage<M, R>(message: Message<M>): Promise<R> {
		return (await browser.runtime.sendMessage(message)) as R;
	}
}
