import { Message } from './Message';

export interface TabMessage<T, D> {
	tabId: number;
	message: Message<T, D>;
}
