import { Message } from '@/communication/message/Message';

export interface TabMessageSender {
	sendMessage<T, R>(receiverTabId: number, message: Message<T>): Promise<R>;
}
