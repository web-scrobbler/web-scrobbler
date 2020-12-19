import { Message } from '@/communication/message/Message';

export interface MessageSender<Type> {
	/**
	 * Send a message.
	 *
	 * @param message Message to send
	 *
	 * @return Response data
	 */
	sendMessage<Data, Response>(
		message: Message<Type, Data>
	): Promise<Response>;
}
