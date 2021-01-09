import { Account } from '@/background/account/Account';
import { Session } from '@/background/account/Session';

import { LastFmScrobbler } from '@/background/scrobbler/LastFmScrobbler';
import { Scrobbler } from '@/background/scrobbler/Scrobbler';

import { getAccountsRepository } from '@/background/repository/GetAccountsRepository';

type FactoryFunction = (session: Session) => Scrobbler;

const factoryFunctions: Record<string, FactoryFunction> = {
	'last-fm': createLastFmScrobbler,
};

export async function createScrobbler(scrobblerId: string): Promise<Scrobbler> {
	if (scrobblerId in factoryFunctions) {
		const factoryFunction = factoryFunctions[scrobblerId];
		const scrobblerAccount = await getScrobblerAccount(scrobblerId);

		return factoryFunction(scrobblerAccount.session);
	}

	throw new Error(`Unable to create scrobbler with ${scrobblerId} ID`);
}

function createLastFmScrobbler(session: Session): Scrobbler {
	return new LastFmScrobbler(session);
}

async function getScrobblerAccount(scrobblerId: string): Promise<Account> {
	const accountsRepository = getAccountsRepository();
	return await accountsRepository.getAccount(scrobblerId);
}
