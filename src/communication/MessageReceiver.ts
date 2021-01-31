import { Message } from '@/communication/message/Message';

export interface CommunicationWorker<T, D = unknown> {
	/**
	 * Process the given message.
	 *
	 * @param message Message
	 *
	 * @return Process result
	 */
	processMessage(message: Message<T, D>): Promise<unknown>;

	/**
	 * Check if the receiver can process message.
	 *
	 * @param message Message
	 *
	 * @return Check result
	 */
	canProcessMessage(message: Message<unknown, unknown>): boolean;
}
