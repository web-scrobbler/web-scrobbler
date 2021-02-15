import { browser } from 'webextension-polyfill-ts';
import Logger from 'js-logger';

import { migrate } from '@/background/util/migrate';

import { getCoreRepository } from '@/background/repository/GetCoreRepository';
import { createScrobblerManager } from '@/background/scrobbler/ScrobblerManagerFactory';
import { AccountsWorker } from '@/communication/accounts/AccountsWorker';
import { getAccountsRepository } from '@/background/repository/GetAccountsRepository';
import { AudioScrobblerScrobbleService } from '@/background/scrobbler/audioscrobbler/AudioScrobblerScrobbleService';
import { LastFmAppInfo } from '@/background/scrobbler/audioscrobbler/LastFmAppInfo';
import { SongPipeline } from '@/background/pipeline/SongPipeline';
import { FieldNormalizer } from '@/background/pipeline/processor/FieldNormalizer';
import { CoverArtProcessor } from '@/background/pipeline/processor/CoverArtProcessor';
import { EditedTracks } from '@/background/repository/edited-tracks/EditedTracks';
import { EditedInfoProcessor } from '@/background/pipeline/processor/EditedInfoProcessor';
import { ScrobblerSession } from '@/background/scrobbler/ScrobblerSession';
import { ExternalTrackInfoLoader } from '@/background/pipeline/processor/ExternalTrackInfoLoader';
import { TrackContextInfoProvider } from '@/background/provider/TrackContextInfoProvider';
import { TrackContextInfoLoader } from '@/background/pipeline/processor/TrackContextInfoLoader';
import { getEditedTracks } from '@/background/repository/GetEditedTracks';
import { fetchJson } from '@/background/util/fetch/FetchJson';
import { Message } from '@/communication/message/Message';
import { CommunicationWorker } from '@/communication/CommunicationWorker';
import { TabWorker } from '@/background/object/tab-worker';
import { BrowserTabListener } from '@/background/BrowserTabListener';
import { ConnectorState } from '@/background/model/ConnectorState';
import { ControllerWorker } from '@/communication/controller/ControllerWorker';
import { ConnectorInjectorImpl } from '@/background/browser/inject';
import { ContentScriptMessageSender } from '@/communication/sender/ContentScriptMessageSender';
import { NotificationDisplayer } from '@/background/NotificationDisplayer';
import { ControllerFactoryImpl } from '@/background/object/controller/ControllerFactoryImpl';
import { createContextMenuWorker } from '@/background/ContextMenuWorkerFactory';
import { BrowserNotifications } from '@/background/browser/notifications/BrowserNotifications';
import { AuthReminder } from '@/background/auth-reminder/AuthReminder';
import { BrowserAuthNotifier } from '@/background/auth-reminder/BrowserAuthNotifier';
import { getNotificationsRepository } from '@/background/repository/GetNotificationsRepository';
import { CoverArtArchiveProvider } from '@/background/provider/CoverArtArchiveProvider';
import { getExtensionOptions } from '@/background/repository/GetExtensionOptions';
import { GeneralScrobblerFactory } from '@/background/scrobbler/GeneralScrobblerFactory';
import { ScrobblerAuthenticatorFactory } from '@/background/authenticator/ScrobblerAuthenticatorFactory';

Logger.useDefaults({ defaultLevel: Logger.DEBUG });
const mainLogger = Logger.get('Main');

main();

async function main() {
	await migrate();
	updateCoreVersion();

	const scrobblerFactory = new GeneralScrobblerFactory();
	const authenticatorFactory = new ScrobblerAuthenticatorFactory(
		scrobblerFactory
	);

	const accountsRepository = getAccountsRepository();
	const scrobblerManager = await createScrobblerManager(
		accountsRepository,
		scrobblerFactory,
		Logger.get('ScrobblerManager')
	);

	mainLogger.debug(
		`Initialized scrobble manager with ${
			Array.from(scrobblerManager).length
		} scrobblers`
	);

	const notifications = new BrowserNotifications();

	const connectorInjector = new ConnectorInjectorImpl(
		async (tabId, options) => {
			await browser.tabs.executeScript(tabId, options);
		},
		new ContentScriptMessageSender(),
		Logger.get('ConnectorInjector')
	);

	const editedTracks = getEditedTracks();
	const trackPipeline = createTrackPipeline(editedTracks, scrobblerManager);

	const controllerFactory = new ControllerFactoryImpl(
		scrobblerManager,
		trackPipeline
	);

	const options = getExtensionOptions();

	const tabWorker = new TabWorker(
		controllerFactory,
		connectorInjector,
		new NotificationDisplayer(notifications, options),
		createContextMenuWorker
	);

	const controllerWorker = new ControllerWorker(tabWorker);

	const authWorker = new AccountsWorker(
		scrobblerManager,
		accountsRepository,
		scrobblerFactory,
		authenticatorFactory
	);

	const authNotifier = new BrowserAuthNotifier(notifications);
	const notificationsRepository = getNotificationsRepository();
	const authReminder = new AuthReminder(
		notificationsRepository,
		authNotifier
	);
	authReminder.notifyAuthIsRequired();

	setupCommunicationWorkers(authWorker, controllerWorker);
	setupBrowserTabListener(tabWorker);
}

function updateCoreVersion() {
	const { version } = browser.runtime.getManifest();

	const coreRepository = getCoreRepository();
	coreRepository.setExtensionVersion(version);
}

function createTrackPipeline(
	editedTracks: EditedTracks,
	trackContextInfoProvider: TrackContextInfoProvider
): SongPipeline {
	const fieldNormalizer = new FieldNormalizer();

	const editedInfoProcessor = new EditedInfoProcessor(editedTracks);

	const externalTrackInfoLoader = new ExternalTrackInfoLoader(
		new AudioScrobblerScrobbleService(
			ScrobblerSession.createEmptySession(),
			LastFmAppInfo
		)
	);

	const trackContextInfoLoader = new TrackContextInfoLoader(
		trackContextInfoProvider
	);

	const coverArtProcessor = new CoverArtProcessor(
		new CoverArtArchiveProvider(fetchJson)
	);

	const processors = [
		fieldNormalizer,
		editedInfoProcessor,
		externalTrackInfoLoader,
		trackContextInfoLoader,
		coverArtProcessor,
	];
	return new SongPipeline(processors, Logger.get('SongPipeline'));
}

function setupCommunicationWorkers(
	...receivers: ReadonlyArray<CommunicationWorker<unknown>>
): void {
	// Should be only single listener to allow receiving return data
	browser.runtime.onMessage.addListener(
		(message: Message<unknown, unknown>) => {
			for (const receiver of receivers) {
				if (receiver.canProcessMessage(message)) {
					return receiver.processMessage(message);
				}
			}

			mainLogger.warn('Received unknown message:', message.type);
		}
	);
}

function setupBrowserTabListener(listener: BrowserTabListener): void {
	try {
		browser.commands.onCommand.addListener((command: string) => {
			listener.processCommand(command);
		});
	} catch {
		// Don't let the extension fail on Firefox for Android.
	}

	browser.tabs.onUpdated.addListener((_, changeInfo, tab) => {
		if (changeInfo.status !== 'complete') {
			return;
		}

		listener.processTabUpdate(tab.id, tab.url);
	});

	browser.tabs.onRemoved.addListener((tabId) => {
		listener.processTabRemove(tabId);
	});

	browser.tabs.onActivated.addListener((activeInfo) => {
		listener.processTabChange(activeInfo.tabId);
	});

	browser.runtime.onConnect.addListener((port) => {
		port.onMessage.addListener((message: Message<unknown, unknown>) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const { type, data } = message;
			const tabId = port.sender.tab.id;

			// FIXME Add type check

			listener.processConnectorState(tabId, data as ConnectorState);
		});
	});
}
