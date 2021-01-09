import { Account } from '@/background/account/Account';

export interface AccountsRepository {
	getAccount(scrobblerId: string): Promise<Account>;
}
