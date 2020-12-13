import { browser } from 'webextension-polyfill-ts';

import { Extension } from '@/background/extension';
import { migrate } from '@/background/util/migrate';

import { getCoreRepository } from '@/background/repository/GetCoreRepository';
import { getNotificationsRepository } from '@/background/repository/GetNotificationsRepository';

main();

async function main() {
	const coreRepository = getCoreRepository();
	const notificationsRepository = getNotificationsRepository();

	await migrate();

	coreRepository.setExtensionVersion(getExtentsionVersion());

	new Extension(notificationsRepository).start();
}

function getExtentsionVersion(): string {
	return browser.runtime.getManifest().version;
}
