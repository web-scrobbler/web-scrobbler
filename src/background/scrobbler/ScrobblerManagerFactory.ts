import { ScrobblerManagerImpl } from '@/background/scrobbler/manager/ScrobblerManagerImpl';

import { ScrobblerFactory } from '@/background/scrobbler/ScrobblerFactory';
import { getAllScrobblerIds } from '@/background/scrobbler/ScrobblerId';

import type { AccountsRepository } from '@/background/repository/accounts/AccountsRepository';
import type { ScrobblerManager } from '@/background/scrobbler/ScrobblerManager';

export async function createScrobblerManager(
	accountsRepository: AccountsRepository,
	scrobblerFactory: ScrobblerFactory
): Promise<ScrobblerManager> {
	const scrobblerManager = new ScrobblerManagerImpl();

	const scrobblerIds = getAllScrobblerIds();
	for (const scrobblerId of scrobblerIds) {
		const account = await accountsRepository.getAccount(scrobblerId);

		try {
			const scrobbler = scrobblerFactory(scrobblerId, account);
			scrobblerManager.useScrobbler(scrobbler);
		} catch {
			continue;
		}
	}

	return scrobblerManager;
}
