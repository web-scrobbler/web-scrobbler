import { browser } from 'webextension-polyfill-ts';

import { getCurrentTab } from '@/common/util-browser';

import { MessageSender } from '../MessageSender';
import { Message } from '../message/Message';

export class CurrentTabMessageSender implements MessageSender {
	async sendMessage<M, R>(message: Message<M>): Promise<R> {
		const tabId = await getCurrentTab();
		return (await browser.runtime.sendMessage({ tabId, message })) as R;
	}
}
