import { Message } from '@/communication/message/Message';

export interface MessageReceiver {
	onMessageReceived(message: Message<unknown>): unknown;
}
