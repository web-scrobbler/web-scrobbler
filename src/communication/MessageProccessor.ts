import { Message } from '@/communication/message/Message';

export interface MessageProccessor {
	processMessage(message: Message<unknown>): Promise<unknown>;
}
