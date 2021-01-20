import { AccountsRepositoryImpl } from '@/background/repository/accounts/AccountRepositoryImpl';
import { AccountsRepository } from '@/background/repository/accounts/AccountsRepository';

export function getAccountsRepository(): AccountsRepository {
	return accountsRepository;
}

const accountsRepository = new AccountsRepositoryImpl();
