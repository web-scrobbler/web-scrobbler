import { Controller } from '@/background/object/controller';

import { MessageProccessor } from '@/communication/MessageProccessor';
import { ControllerMessageProcessorImpl } from '@/communication/controller/processor/ControllerMessageProcessorImpl';
import { ControllerMessageType } from '@/communication/controller/ControllerMessageType';

export function createControllerReceiver(
	controller: Controller
): MessageProccessor<ControllerMessageType> {
	return new ControllerMessageProcessorImpl(controller);
}
