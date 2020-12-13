import { ControllerMessageSender } from './controller/sender/ControllerMessageSender';
import { ControllerMessageSenderImpl } from './controller/sender/ControllerMessageSenderImpl';

import { CurrentTabMessageSender } from './sender/CurrentTabMessageSender';

export function getControllerCommunicator(): ControllerMessageSender {
	return controllerCommunicator;
}

const controllerCommunicator = new ControllerMessageSenderImpl(
	new CurrentTabMessageSender()
);
