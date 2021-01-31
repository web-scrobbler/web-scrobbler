import { AccountsCommunicatorImpl } from '@/communication/accounts/AccountsCommunicatorImpl';
import { ControllerCommunicatorImpl } from './controller/ControllerCommunicatorImpl';
import { GlobalMessageSender } from '@/communication/sender/GlobalMessageSender';

import type { AccountsCommunicator } from '@/communication/accounts/AccountsCommunicator';
import type { ControllerCommunicator } from './controller/ControllerCommunicator';

export function getControllerCommunicator(): ControllerCommunicator {
	return new ControllerCommunicatorImpl(new GlobalMessageSender());
}

export function getAccountsCommunicator(): AccountsCommunicator {
	return new AccountsCommunicatorImpl(new GlobalMessageSender());
}
