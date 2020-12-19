import { Message } from '@/communication/message/Message';

export interface TabMessageSender<Type, Receiver> {
	sendMessage<Data, Response>(
		receiver: Receiver,
		message: Message<Type, Data>
	): Promise<Response>;
}
