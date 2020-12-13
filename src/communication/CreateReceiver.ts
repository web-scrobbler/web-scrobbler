import { Controller } from '@/background/object/controller';

import { MessageReceiver } from '@/communication/MessageReceiver';
import { ControllerMessageReceiverImpl } from '@/communication/controller/receiver/ControllerMessageReceiverImpl';

export function createControllerReceiver(
	controller: Controller
): MessageReceiver {
	return new ControllerMessageReceiverImpl(controller);
}
