import { browser } from 'webextension-polyfill-ts';

import { Extension } from '@/background/extension';
import { migrate } from '@/background/util/migrate';

import { getCoreRepository } from '@/background/repository/GetCoreRepository';
import { getNotificationsRepository } from '@/background/repository/GetNotificationsRepository';
import { createScrobblerManager } from '@/background/scrobbler/ScrobblerManagerFactory';

import Logger from 'js-logger';

main();

async function main() {
	Logger.useDefaults({ defaultLevel: Logger.DEBUG });

	const coreRepository = getCoreRepository();
	const notificationsRepository = getNotificationsRepository();

	await migrate();

	coreRepository.setExtensionVersion(getExtentsionVersion());

	new Extension(notificationsRepository).start();

	const manager = await createScrobblerManager();
}

function getExtentsionVersion(): string {
	return browser.runtime.getManifest().version;
}
