import { Message } from '@/communication/message/Message';
import { MessageProccessor } from '@/communication/MessageProccessor';
import { MessageSender } from '@/communication/MessageSender';

export class MockedMessageSender<T> implements MessageSender<T> {
	constructor(private messageProcessor: MessageProccessor<T>) {}

	async sendMessage<D, R>(message: Message<T, D>): Promise<R> {
		return (await this.messageProcessor.processMessage(message)) as R;
	}
}
