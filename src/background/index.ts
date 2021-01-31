import { browser } from 'webextension-polyfill-ts';
import Logger from 'js-logger';

import { migrate } from '@/background/util/migrate';

import { getCoreRepository } from '@/background/repository/GetCoreRepository';
import { createScrobblerManager } from '@/background/scrobbler/ScrobblerManagerFactory';
import { AccountsWorker } from '@/communication/accounts/AccountsWorker';
import { getAccountsRepository } from '@/background/repository/GetAccountsRepository';
import { createAuthenticator } from '@/background/authenticator/ScrobblerAuthenticatorFactory';
import { createScrobbler } from '@/background/scrobbler/ScrobblerFactory';
import { createAuthRemindFunction } from '@/background/auth-remind/AuthRemindFunctionFactory';
import { AudioScrobblerScrobbleService } from '@/background/scrobbler/audioscrobbler/AudioScrobblerScrobbleService';
import { LastFmAppInfo } from '@/background/scrobbler/audioscrobbler/LastFmAppInfo';
import { SongPipeline } from '@/background/pipeline/SongPipeline';
import { Processor } from '@/background/pipeline/Processor';
import { Song } from '@/background/model/song/Song';
import { FieldNormalizer } from '@/background/pipeline/processor/FieldNormalizer';
import { CoverArtArchiveProvider } from '@/background/provider/CoverArtArchiveProvider';
import { CoverArtProcessor } from '@/background/pipeline/processor/CoverArtProcessor';
import { EditedTracks } from '@/background/repository/edited-tracks/EditedTracks';
import { EditedInfoProcessor } from '@/background/pipeline/processor/EditedInfoProcessor';
import { ScrobblerSession } from '@/background/account/ScrobblerSession';
import { ExternalTrackInfoLoader } from '@/background/pipeline/processor/ExternalTrackInfoLoader';
import { TrackContextInfoProvider } from '@/background/provider/TrackContextInfoProvider';
import { TrackContextInfoLoader } from '@/background/pipeline/processor/TrackContextInfoLoader';
import { getEditedTracks } from '@/background/repository/GetEditedTracks';
import { fetchJson } from '@/background/util/fetch/FetchJson';
import { MusicBrainzAlbumIdProvider } from '@/background/provider/album-id/MusicBrainzAlbumIdProvider';
import { AlbumIdLoader } from '@/background/pipeline/processor/AlbumIdLoader';
import { Message } from '@/communication/message/Message';
import { CommunicationWorker } from '@/communication/MessageReceiver';
import { TabWorker } from '@/background/object/tab-worker';
import { BrowserTabListener } from '@/background/BrowserTabListener';
import { ConnectorState } from '@/background/model/ConnectorState';
import { ControllerWorker } from '@/communication/controller/ControllerWorker';
import { ConnectorInjectorImpl } from '@/background/browser/inject';
import { ContentScriptMessageSender } from '@/communication/sender/ContentScriptMessageSender';
import { NotificationDisplayer } from '@/background/NotificationDisplayer';

Logger.useDefaults({ defaultLevel: Logger.DEBUG });
const mainLogger = Logger.get('Main');

main();

async function main() {
	await migrate();
	updateCoreVersion();

	const accountsRepository = getAccountsRepository();
	const scrobbleManager = await createScrobblerManager(
		accountsRepository,
		createScrobbler
	);

	mainLogger.debug(
		`Initialized scrobble manager with ${
			Array.from(scrobbleManager).length
		} scrobblers`
	);

	const injector = new ConnectorInjectorImpl(async (tabId, options) => {
		await browser.tabs.executeScript(tabId, options);
	}, new ContentScriptMessageSender());

	const tabWorker = new TabWorker(
		scrobbleManager,
		injector,
		new NotificationDisplayer()
	);

	const controllerWorker = new ControllerWorker(tabWorker);

	const authWorker = new AccountsWorker(
		scrobbleManager,
		accountsRepository,
		createScrobbler,
		createAuthenticator
	);

	const remindFn = createAuthRemindFunction();
	remindFn();

	setupCommunicationWorkers(authWorker, controllerWorker);
	setupBrowserTabListener(tabWorker);

	const editedTracks = getEditedTracks();

	const pipeline = createTrackPipeline(editedTracks, scrobbleManager);
}

function updateCoreVersion() {
	const { version } = browser.runtime.getManifest();

	const coreRepository = getCoreRepository();
	coreRepository.setExtensionVersion(version);
}

function createTrackPipeline(
	editedTracks: EditedTracks,
	trackContextInfoProvider: TrackContextInfoProvider
): Processor<Song> {
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

	const albumIdLoader = new AlbumIdLoader(
		new MusicBrainzAlbumIdProvider(fetchJson)
	);

	const coverArtProcessor = new CoverArtProcessor(
		new CoverArtArchiveProvider()
	);

	const processors = [
		fieldNormalizer,
		editedInfoProcessor,
		externalTrackInfoLoader,
		trackContextInfoLoader,
		albumIdLoader,
		coverArtProcessor,
	];
	return new SongPipeline(processors);
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
