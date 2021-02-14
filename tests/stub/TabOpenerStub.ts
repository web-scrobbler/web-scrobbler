import type { TabOpener } from '@/background/authenticator/tab-opener/TabOpener';

export const tabOpenerStub: TabOpener = () => {
	return Promise.resolve();
};
