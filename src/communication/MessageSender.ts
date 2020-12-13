import { Message } from '@/communication/message/Message';

export interface MessageSender {
	/**
	 * Send a message.
	 *
	 * @param message Message to send
	 *
	 * @return Response data
	 */
	sendMessage<T, R>(message: Message<T>): Promise<R>;
}
