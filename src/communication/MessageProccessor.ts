import { Message } from '@/communication/message/Message';

export interface MessageProccessor<T> {
	processMessage(message: Message<T, unknown>): Promise<unknown>;
}
