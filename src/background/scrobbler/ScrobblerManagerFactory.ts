import { ScrobblerManagerImpl } from '@/background/scrobbler/manager/ScrobblerManagerImpl';
import type { ScrobblerManager } from '@/background/scrobbler/ScrobblerManager';

import { getAllScrobblerIds } from '@/background/scrobbler/ScrobblerId';

import { createScrobbler } from '@/background/scrobbler/ScrobblerFactory';
import {
	createSessionFromUserProperties,
	isSessionEmpty,
} from '@/background/account/Session';
import { getAccountsRepository } from '@/background/repository/GetAccountsRepository';

export async function createScrobblerManager(): Promise<ScrobblerManager> {
	const scrobblerManager = new ScrobblerManagerImpl();
	const accountsRepository = getAccountsRepository();

	const scrobblerIds = getAllScrobblerIds();
	for (const scrobblerId of scrobblerIds) {
		let { session, userProperties } = await accountsRepository.getAccount(
			scrobblerId
		);
		try {
			session = createSessionFromUserProperties(userProperties);
		} catch {}

		if (isSessionEmpty(session)) {
			continue;
		}

		const scrobbler = createScrobbler(scrobblerId, session, userProperties);
		scrobblerManager.useScrobbler(scrobbler);
	}

	return scrobblerManager;
}
