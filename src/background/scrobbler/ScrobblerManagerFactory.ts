import { ScrobblerManagerImpl } from '@/background/scrobbler/manager/ScrobblerManagerImpl';

import type { AccountsRepository } from '@/background/repository/accounts/AccountsRepository';
import type { ScrobblerFactory } from '@/background/scrobbler/ScrobblerFactory';
import type { ScrobblerManager } from '@/background/scrobbler/ScrobblerManager';

/**
 * Create a scrobbler manager using all available accounts.
 *
 * @param accountsRepository Repository containing user accounts
 * @param scrobblerFactory Function that creates scrobbler objects
 *
 * @return Scrobbler manager
 */
export async function createScrobblerManager(
	accountsRepository: AccountsRepository,
	scrobblerFactory: ScrobblerFactory
): Promise<ScrobblerManager> {
	const scrobblerManager = new ScrobblerManagerImpl();

	for await (const account of accountsRepository) {
		try {
			const scrobbler = scrobblerFactory(account);
			scrobblerManager.useScrobbler(scrobbler);
		} catch {
			continue;
		}
	}

	return scrobblerManager;
}
