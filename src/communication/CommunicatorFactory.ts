import { AccountsCommunicatorImpl } from '@/communication/accounts/AccountsCommunicatorImpl';
import { ControllerCommunicatorImpl } from './controller/ControllerCommunicatorImpl';
import { EditedTracksCommunicator } from '@/communication/edited-tracks/EditedTracksCommunicator';
import { GlobalMessageSender } from '@/communication/sender/GlobalMessageSender';

import type { AccountsCommunicator } from '@/communication/accounts/AccountsCommunicator';
import type { ControllerCommunicator } from './controller/ControllerCommunicator';
import { ScrobbleCacheCommunicator } from '@/communication/scrobble-cache/ScrobbleCacheCommunicator';

const globalMessageSender = new GlobalMessageSender();

export function getControllerCommunicator(): ControllerCommunicator {
	return new ControllerCommunicatorImpl(globalMessageSender);
}

export function getAccountsCommunicator(): AccountsCommunicator {
	return new AccountsCommunicatorImpl(globalMessageSender);
}

export function createEditedTracksCommunicator(): EditedTracksCommunicator {
	return new EditedTracksCommunicator(globalMessageSender);
}

export function createScrobbleStorageCommunicator(): ScrobbleCacheCommunicator {
	return new ScrobbleCacheCommunicator(globalMessageSender);
}
