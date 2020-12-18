import { ControllerCommunicator } from './controller/communicator/ControllerCommunicator';
import { ControllerCommunicatorImpl } from './controller/communicator/ControllerCommunicatorImpl';

import { CurrentTabMessageSender } from './sender/CurrentTabMessageSender';

export function getControllerCommunicator(): ControllerCommunicator {
	return new ControllerCommunicatorImpl(new CurrentTabMessageSender());
}
