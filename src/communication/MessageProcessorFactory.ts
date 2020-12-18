import { Controller } from '@/background/object/controller';

import { MessageProccessor } from '@/communication/MessageProccessor';
import { ControllerMessageProcessorImpl } from '@/communication/controller/processor/ControllerMessageProcessorImpl';

export function createControllerReceiver(
	controller: Controller
): MessageProccessor {
	return new ControllerMessageProcessorImpl(controller);
}
