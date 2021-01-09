import { AccountsRepositoryImpl } from '@/background/repository/accounts/AccountRepositoryImpl';

export function getAccountsRepository(): AccountsRepositoryImpl {
	return accountsRepository;
}

const accountsRepository = new AccountsRepositoryImpl();
