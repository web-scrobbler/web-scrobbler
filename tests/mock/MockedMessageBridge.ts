import { Message } from '@/communication/message/Message';
import { MessageProccessor } from '@/communication/MessageProccessor';
import { MessageSender } from '@/communication/MessageSender';

export class MockedMessageSender implements MessageSender {
	constructor(private messageProcessor: MessageProccessor) {}

	async sendMessage<T, R>(message: Message<T>): Promise<R> {
		return (await this.messageProcessor.processMessage(message)) as R;
	}
}
