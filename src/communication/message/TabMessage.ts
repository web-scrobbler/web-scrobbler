import { Message } from './Message';

export interface TabMessage<T> {
	tabId: number;
	message: Message<T>;
}
