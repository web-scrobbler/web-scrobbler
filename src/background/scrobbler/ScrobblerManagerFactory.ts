import { ScrobblerManagerImpl } from '@/background/scrobbler/manager/ScrobblerManagerImpl';
import type { ScrobblerManager } from '@/background/scrobbler/ScrobblerManager';

import { createScrobbler } from '@/background/scrobbler/ScrobblerFactory';
import { getAccountsRepository } from '@/background/repository/GetAccountsRepository';
import { getAllScrobblerIds } from '@/background/scrobbler/ScrobblerId';

export async function createScrobblerManager(): Promise<ScrobblerManager> {
	const scrobblerManager = new ScrobblerManagerImpl();
	const accountsRepository = getAccountsRepository();

	const scrobblerIds = getAllScrobblerIds();
	for (const scrobblerId of scrobblerIds) {
		const account = await accountsRepository.getAccount(scrobblerId);

		try {
			const scrobbler = createScrobbler(scrobblerId, account);
			scrobblerManager.useScrobbler(scrobbler);
		} catch {
			continue;
		}
	}

	return scrobblerManager;
}
