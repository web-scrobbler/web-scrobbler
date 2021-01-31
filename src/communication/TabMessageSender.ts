import { Message } from '@/communication/message/Message';

export interface TabMessageSender<Type> {
	sendMessage<Data, Response>(
		tabId: number,
		message: Message<Type, Data>
	): Promise<Response>;
}
