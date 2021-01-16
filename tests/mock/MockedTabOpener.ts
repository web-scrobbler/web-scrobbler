import type { TabOpener } from '@/background/authenticator/tab-opener/TabOpener';

export const MockedTabOpener: TabOpener = () => {
	return Promise.resolve();
};
