import { Message } from '@/communication/message/Message';
import { MessageSender } from '@/communication/MessageSender';

export class MockedMessageBridge implements MessageSender {
	sendMessage<T, R>(message: Message<T>): Promise<R> {
		throw new Error('Method not implemented.');
	}
	// private;
}
