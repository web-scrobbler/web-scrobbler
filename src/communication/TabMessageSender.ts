import { Message } from '@/communication/message/Message';

export interface TabMessageSender<Receiver> {
	sendMessage<Data, Response>(
		receiver: Receiver,
		message: Message<Data>
	): Promise<Response>;
}
